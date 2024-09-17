import mongoose from "mongoose";
import { MONGO_DB_URI } from "../modules/utils/constants.js";

// conexion a la mongodb
mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Error connecting to database: ", err);
  });

// cerrar el servidor cuando haya un error
process.on("uncaughtException", (error) => {
  console.error(error);
  mongoose.disconnect();
});
