import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// server
const $PORT = process.env.PORT || app.get("port");
app.listen($PORT, () => {
  console.log(`Listening on: http://localhost:${$PORT}`);
});
