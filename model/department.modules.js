import mongoose, { Schema } from "mongoose";

const departmentSchema = {
  name: String,
};

export const Department = mongoose.model("Department", departmentSchema);
