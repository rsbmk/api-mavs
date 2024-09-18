import mongoose from "mongoose";
import { MONGO_DB_URI } from "../src/common/constants.js";

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Error connecting to database: ", err);
  });

// disconnect mongoose connection on process exit
process.on("uncaughtException", (error) => {
  console.error(error);
  mongoose.disconnect();
});
