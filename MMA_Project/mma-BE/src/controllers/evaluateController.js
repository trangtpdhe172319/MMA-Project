// controllers/evaluateController.js

const Evaluate = require("../models/evaluate")

// Tạo mới một đánh giá
exports.createEvaluate = async (req, res) => {
  const { rating, comment } = req.body

  if (!rating) {
    return res.status(400).send("Missing required fields")
  }

  try {
    const newEvaluate = new Evaluate({ rating, comment })

    await newEvaluate.save()
    res
      .status(201)
      .json({ message: "Evaluate created successfully", data: newEvaluate })
  } catch (err) {
    res.status(500).json({ message: "Error creating evaluate", error: err })
  }
}

// Lấy tất cả đánh giá
exports.getAllEvaluates = async (req, res) => {
  try {
    const evaluations = await Evaluate.find({})
    res.status(200).json(evaluations)
  } catch (err) {
    res.status(500).json({ message: "Error fetching evaluations", error: err })
  }
}
