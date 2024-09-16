import mongoose from "mongoose";
const connectionString = process.env.MONGO_DB_URI;

// conexion a la mongodb
mongoose
  .connect(connectionString)
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
