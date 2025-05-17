const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const adminRoutes = require("./routes/adminRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Custom logging middleware using morgan
morgan.token("req-body", (req) => JSON.stringify(req.body)); // Log request body
morgan.token("res-body", (req, res) => JSON.stringify(res.body)); // Log response body

// Custom morgan logging format
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body :res-body", {
  stream: {
    write: (message) => {
      // Create a creative log format for both request and response
      console.log(`✨ Request Log: ${message}`);
    }
  }
}));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/candidate", candidateRoutes);
app.use('/api/auth', authRoutes);

// DB + Server Init
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => console.error("💥 Mongo Error:", err));

// Example of logging all requests creatively
app.use((req, res, next) => {
  console.log(`🌟 Incoming Request - Method: ${req.method} | URL: ${req.originalUrl}`);
  next();
});

// Log response after finishing request
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    console.log(`📡 Response Sent - Status: ${res.statusCode} | Body: ${data}`);
    oldSend.apply(res, arguments);
  };
  next();
});
