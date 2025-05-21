const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "garage_owner", "admin"],
      required: true
    },
    vehicles: [
      {
        licensePlate: { type: String, required: true },
        brand: String,
        model: String,
        year: Number,
        color: String // Bổ sung thêm màu xe
      }
    ],
    isActive: { type: Boolean, default: true } // Kiểm soát tài khoản có hoạt động không
  },
  { timestamps: true } // Thêm cả updatedAt
)

module.exports = mongoose.model("User", UserSchema, "users")
