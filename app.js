import express from "express";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import departmentRouter from "./routes/department.routes.js";
import leaveRouter from "./routes/leave.routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRouter);
app.use("/api/leave", leaveRouter);

export { app };
