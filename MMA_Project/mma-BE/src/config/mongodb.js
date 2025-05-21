const mongoose = require("mongoose")

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/MMA")
    console.log("Successaka")
  } catch (error) {
    console.log("Fail")
  }
}
module.exports = { connect }
