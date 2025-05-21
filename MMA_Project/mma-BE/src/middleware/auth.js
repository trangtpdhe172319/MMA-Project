const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (!token) return res.status(401).json({ error: "Không có token" })
  console.log(token)

  try {
    const decoded = jwt.verify(token, "a_Son_Dang_Cap_Vip_Pro")
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token đã hết hạn" })
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token không hợp lệ" })
    }
    res.status(500).json({ error: "Lỗi xác thực token" })
  }
}

module.exports = authMiddleware