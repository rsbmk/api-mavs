import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { PORT } from "./common/constants.js";

// server
app.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${PORT}`);
});
