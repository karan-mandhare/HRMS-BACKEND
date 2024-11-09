import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const employeeSchema = Schema(
  {
    name: String,
    department: String,
    gender: {
      type: String,
      enum: ["M", "F"],
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: Number,
      unique: true,
    },
    photo: String,
    dob: String,
    doj: String,
    city: String,
    state: String,
    country: String,
    address: String,
    password: String,
    salary: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRETE,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const Employee = mongoose.model("Employee", employeeSchema);
