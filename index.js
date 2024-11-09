import dotenv from "dotenv";
import connectToMongodb from "./db/config.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectToMongodb()
  .then(() => {
    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
