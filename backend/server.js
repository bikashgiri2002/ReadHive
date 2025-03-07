const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config.js");

const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.use(cors());
    app.use(express.json());
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
