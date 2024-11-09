import mongoose, { Schema } from "mongoose";

const leaveSchema = Schema(
  {
    name: String,
    photo: String,
    department: String,
    reason: String,
    startdate: String,
    enddate: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    desc: String,
  },
  {
    timestamps: true,
  }
);

export const Leave = mongoose.model("Leave", leaveSchema);
