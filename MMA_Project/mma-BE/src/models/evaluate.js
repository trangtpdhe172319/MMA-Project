// models/evaluateModel.js

const mongoose = require("mongoose")

const evaluateSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: false },
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Evaluate", evaluateSchema)
