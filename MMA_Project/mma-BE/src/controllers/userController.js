const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role, vehicles } = req.body

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" })
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10)

    // Kiểm tra nếu có dữ liệu vehicles, đảm bảo nó là mảng hợp lệ
    let vehicleData = []
    if (Array.isArray(vehicles)) {
      vehicleData = vehicles.map((vehicle) => ({
        licensePlate: vehicle.licensePlate?.trim(),
        brand: vehicle.brand?.trim(),
        model: vehicle.model?.trim(),
        year: vehicle.year,
        color: vehicle.color?.trim()
      }))
    }

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      vehicles: vehicleData // Thêm thông tin xe vào
    })

    await newUser.save()

    res.status(201).json({
      message: "Đăng ký thành công",
      userId: newUser._id
    })
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error })
  }
}

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" })
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      },
      "a_Son_Dang_Cap_Vip_Pro",
      { expiresIn: "7d" } // Token hết hạn sau 7 ngày
    )

    res.status(200).json({ message: "Đăng nhập thành công", token })
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error })
  }
}

module.exports = { register, login }
