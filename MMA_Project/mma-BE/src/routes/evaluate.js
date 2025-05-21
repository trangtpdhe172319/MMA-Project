// routes/evaluateRoutes.js

const express = require("express")
const router = express.Router()
const evaluateController = require("../controllers/evaluateController")

// Tạo mới một đánh giá
router.post("/", evaluateController.createEvaluate)

// Lấy tất cả đánh giá
router.get("/", evaluateController.getAllEvaluates)

module.exports = router
