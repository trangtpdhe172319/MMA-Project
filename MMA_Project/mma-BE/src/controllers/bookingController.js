const Booking = require("~/models/Booking")

// Lấy tất cả booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().lean()
    // const bookings = await Booking.find().populate('customerId').populate('garageId');
    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error })
  }
}

exports.getAllBookingsOfUser = async (req, res) => {
  try {
    const bookings = await Booking.find().lean()

    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error })
  }
}
// // Tạo booking mới
// exports.createBooking = async (req, res) => {
//   try {
//     const newBooking = new Booking(req.body);
//     const savedBooking = await newBooking.save();
//     res.status(201).json(savedBooking);
//   } catch (error) {
//     res.status(400).json({ message: 'Lỗi khi tạo booking', error });
//   }
// };
// const Booking = require('../models/Booking');

// 📌 Đặt lịch mới
const mongoose = require("mongoose")

// 📌 Đặt lịch mới
exports.createBooking = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      service,
      bookingDate, // bookingDate cần chứa { date, timeSlot }
      garageId, // Nhận garageId từ FE
      cancelReason
    } = req.body

    // const customerId = '67cfb1494fd45f254a02e4f6';

    // Kiểm tra dữ liệu bắt buộc
    if (
      !customerId ||
      !garageId ||
      !service ||
      !bookingDate ||
      !bookingDate.date ||
      !bookingDate.timeSlot
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" })
    }

    // Chuyển đổi garageId thành ObjectId
    if (!mongoose.Types.ObjectId.isValid(garageId)) {
      return res.status(400).json({ message: "garageId không hợp lệ!" })
    }

    const newBooking = new Booking({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      service,
      bookingDate: {
        date: bookingDate.date,
        timeSlot: bookingDate.timeSlot
      },
      garageId: new mongoose.Types.ObjectId(garageId), // Chuyển đổi sang ObjectId
      status: "Pending",
      cancelReason: cancelReason || ""
    })

    await newBooking.save()

    res.status(201).json({
      message: "Đặt lịch thành công!",
      booking: newBooking
    })
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đặt lịch!", error })
  }
}

// Cập nhật booking (bao gồm lý do hủy nếu bị Cancelled)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { status, cancelReason } = req.body

    const updateData = { status }
    if (status === "Cancelled" && cancelReason) {
      updateData.cancelReason = cancelReason
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true
    })

    if (!updatedBooking) {
      return res.status(404).json({ message: "Không tìm thấy booking" })
    }

    res.status(200).json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    res.status(500).json({ message: "Lỗi khi cập nhật booking", error })
  }
}
