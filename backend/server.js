const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const authRoutes = require("./routes/userRoutes");
app.use("/api/auth", authRoutes);

const queRoutes = require("./routes/queRoutes");
app.use("/api/problems", queRoutes);

const submissionRoutes = require("./routes/subRoutes");
app.use("/api/submissions", submissionRoutes);

const runRoutes = require("./routes/runRoutes");
app.use("/api/run", runRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
