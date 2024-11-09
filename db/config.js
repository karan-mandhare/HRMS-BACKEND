import mongoose from "mongoose";

const connectToMongodb = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://root:root@karans.yuf4s.mongodb.net/hrms?retryWrites=true&w=majority&appName=Karans"
    );
    console.log("Connected to the Database", connection.connection.host);
  } catch (err) {
    console.log("ERROR!! Failed to connect with mongodb", err.message);
  }
};

export default connectToMongodb;
