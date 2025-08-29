require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./config/db");
const helmet = require("helmet");


connectDB();

app.use(cookieParser());

const CLIENT_URL = process.env.CLIENT_URL
app.use(
  cors({
    origin: [CLIENT_URL,"http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());


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
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server running at http://localhost:${port}`);
  }
});
