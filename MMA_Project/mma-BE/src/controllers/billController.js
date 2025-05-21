const Bill = require("~/models/Bill")
const Statistic = require("~/models/Statistic")
const mongoose = require("mongoose")
// Lấy tất cả hóa đơn
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().lean()
    res.status(200).json(bills)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn", error })
  }
}

// Tạo hóa đơn mới
exports.createBill = async (req, res) => {
  try {
    const newBill = new Bill(req.body)
    const savedBill = await newBill.save()
    res.status(201).json(savedBill)
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo hóa đơn", error })
  }
}

// Cập nhật hóa đơn
exports.updateBill = async (req, res) => {
  try {
    const { id } = req.params
    const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true })

    if (!updatedBill) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" })
    }

    res.status(200).json(updatedBill)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật hóa đơn", error })
  }
}

// Lấy chi tiết hóa đơn theo ID
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params
    const bill = await Bill.findById(id).lean()

    if (!bill) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" })
    }

    res.status(200).json(bill)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết hóa đơn", error })
  }
}


exports.getBillsByDay = async (req, res) => {
  try {
    const { garageId } = req.params
    const { date } = req.query // format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Vui lòng cung cấp ngày (YYYY-MM-DD)" })
    }

    // Tạo date một cách an toàn
    const [year, month, day] = date.split("-").map(num => parseInt(num))
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    // Kiểm tra xem start và end có phải là Invalid Date không
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Ngày tháng không hợp lệ" })
    }

    const bills = await Bill.find({
      garageId: new mongoose.Types.ObjectId(garageId),
      createdAt: { $gte: start, $lte: end }
    }).lean()

    res.status(200).json(bills)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách hóa đơn theo ngày", error: error.message })
  }
}

// Phương thức tổng kết bill trong một ngày và tạo thống kê
exports.summarizeDailyBills = async (req, res) => {
  try {
    const { garageId } = req.params
    const { date } = req.query // format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Vui lòng cung cấp ngày (YYYY-MM-DD)" })
    }

    // Tạo date một cách an toàn
    const [year, month, day] = date.split("-").map(num => parseInt(num))
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    // Kiểm tra xem start và end có phải là Invalid Date không
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Ngày tháng không hợp lệ" })
    }

    // Kiểm tra xem ngày này đã được tổng kết chưa
    const existingSummary = await Statistic.findOne({
      garageId: new mongoose.Types.ObjectId(garageId),
      createdAt: { $gte: start, $lte: end }
    })

    if (existingSummary) {
      return res.status(400).json({
        message: "Ngày này đã được tổng kết trước đó",
        summary: existingSummary
      })
    }

    // Tổng hợp thống kê bill trong ngày theo ngày đã chọn (không phải ngày hiện tại)
    const dailyBillsSummary = await Bill.aggregate([
      {
        $match: {
          garageId: new mongoose.Types.ObjectId(garageId),
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ])

    // Lấy dữ liệu từ aggregation
    const summaryData = dailyBillsSummary.length > 0
      ? dailyBillsSummary[0]
      : { totalCustomers: 0, totalRevenue: 0 }

    // Tạo bản ghi thống kê mới với createdAt là ngày đã chọn
    const newStatistic = new Statistic({
      garageId: garageId,
      totalCustomers: summaryData.totalCustomers,
      totalRevenue: summaryData.totalRevenue,
      createdAt: start // Đặt createdAt là ngày đã chọn, không lấy ngày hiện tại
    })

    // Lưu bản ghi thống kê
    const savedStatistic = await newStatistic.save()

    res.status(200).json({
      billSummary: summaryData,
      statisticRecord: savedStatistic
    })
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tổng kết bill trong ngày", error: error.message })
  }
}