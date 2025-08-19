require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

connectDB();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// }));

app.use("/api", require("./Routes/productsRoutes"));
app.use("/api", require("./Routes/productHighlightRoutes"));
app.use("/api", require("./Routes/usersRoutes"));
app.use("/api", require("./Routes/authRoutes"));
app.use("/api", require("./Routes/ordersRoutes"));
app.use("/api", require("./Routes/dashboardRoutes"))
app.use("/api", require("./Routes/imageUploadRoutes"));
app.use("/api", require("./Routes/categoryRoutes"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
