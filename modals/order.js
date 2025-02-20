const mongoose = require("mongoose");

const order = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
    },
    
    status: {
      type: String,
      default: "Order placed",
      enum: ["Order placed", "Out of delivery", "Delivered", "Canceled"],
    },
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("order", order);
