const Garage = require("~/models/Garages")

// Lấy danh sách garage gần vị trí người dùng
exports.getNearbyGarages = async (req, res) => {
  try {
    const latitude = parseFloat(req.query.lat)
    const longitude = parseFloat(req.query.lon)

    const isValidNumber = (num) => !isNaN(num) && isFinite(num)

    if (!isValidNumber(latitude) || !isValidNumber(longitude)) {
      return res.status(400).json({ message: "Vĩ độ và kinh độ không hợp lệ" })
    }

    console.log(`Kinh độ nhận được: ${longitude}, Vĩ độ nhận được: ${latitude}`)

    // Bán kính tìm kiếm khoảng 20km
    const maxDistance = 40 / 111.32 // 1 độ ≈ 111.32 km

    const nearbyGarages = await Garage.find({
      latitude: { $gte: latitude - maxDistance, $lte: latitude + maxDistance },
      longitude: { $gte: longitude - maxDistance, $lte: longitude + maxDistance }
    })

    console.log("Danh sách garage tìm được:", nearbyGarages)

    res.status(200).json({ garages: nearbyGarages })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}


// Thêm mới garage
exports.createGarage = async (req, res) => {
  try {
    const { _id, name, address, latitude, longitude, services, rating, phone, openHours } = req.body

    const newGarage = new Garage({
      _id,
      name,
      address,
      latitude,
      longitude,
      services,
      rating,
      phone,
      openHours
    })

    await newGarage.save()
    res.status(201).json({ message: "Thêm garage thành công!", garage: newGarage })
  } catch (error) {
    console.error("Lỗi khi thêm garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}

// Cập nhật thông tin garage
exports.updateGarage = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedGarage = await Garage.findByIdAndUpdate(id, updateData, { new: true })

    if (!updatedGarage) {
      return res.status(404).json({ message: "Garage không tồn tại." })
    }

    res.status(200).json({ message: "Cập nhật garage thành công!", garage: updatedGarage })
  } catch (error) {
    console.error("Lỗi khi cập nhật garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}

// Xóa garage
exports.deleteGarage = async (req, res) => {
  try {
    const { id } = req.params

    const deletedGarage = await Garage.findByIdAndDelete(id)

    if (!deletedGarage) {
      return res.status(404).json({ message: "Garage không tồn tại." })
    }

    res.status(200).json({ message: "Xóa garage thành công!" })
  } catch (error) {
    console.error("Lỗi khi xóa garage:", error)
    res.status(500).json({ message: "Lỗi server." })
  }
}
