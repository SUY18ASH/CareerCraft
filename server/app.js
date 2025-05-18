const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const atsRoutes = require("./routes/atsRoutes");
const coverRoutes = require("./routes/coverRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("❌  Missing MONGO_URI in .env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌  Missing JWT_SECRET in .env");
  process.exit(1);
}

const app = express();

// CORS configuration
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/cover", coverRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅  MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err);
    process.exit(1);
  });
