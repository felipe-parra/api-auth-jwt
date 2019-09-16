const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      unique: true
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = model("User", userSchema);
