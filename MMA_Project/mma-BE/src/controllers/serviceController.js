const Service = require("~/models/Service")

exports.getServiceByName = async (req, res) => {
  try {
    const { name } = req.params
    const service = await Service.findOne({ name }).lean()

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" })
    }

    res.status(200).json(service)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm dịch vụ", error })
  }
}

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().lean()

    if (!services.length) {
      return res.status(404).json({ message: "Không có dịch vụ nào" })
    }

    res.status(200).json(services)
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error })
  }
}

exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, status } = req.body

    // Kiểm tra nếu dịch vụ đã tồn tại
    const existingService = await Service.findOne({ name })
    if (existingService) {
      return res.status(400).json({ message: "Dịch vụ đã tồn tại" })
    }

    const newService = new Service({
      name,
      description,
      price,
      duration,
      category,
      status
    })
    await newService.save()

    res
      .status(201)
      .json({ message: "Dịch vụ được tạo thành công", service: newService })
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo dịch vụ", error })
  }
}

// Cập nhật thông tin dịch vụ
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params
    const updatedData = req.body

    const updatedService = await Service.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    })

    if (!updatedService) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dịch vụ để cập nhật" })
    }

    res
      .status(200)
      .json({
        message: "Cập nhật dịch vụ thành công",
        service: updatedService
      })
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật dịch vụ", error })
  }
}

// Xóa dịch vụ
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params

    const deletedService = await Service.findByIdAndDelete(id)

    if (!deletedService) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ để xóa" })
    }

    res.status(200).json({ message: "Xóa dịch vụ thành công" })
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa dịch vụ", error })
  }
}
