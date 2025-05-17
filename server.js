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

// Custom function for logging in PowerShell style
const logRequest = (message) => {
  console.log(`🌟 Incoming Request: ${message}`); // Standard log format in PowerShell
};

const logResponse = (message) => {
  console.log(`📡 Response Sent: ${message}`);
};

// Log all incoming requests with the request body
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body", {
  stream: {
    write: (message) => {
      logRequest(message);
    }
  }
}));

// Custom middleware to capture and log the response body
app.use((req, res, next) => {
  let oldSend = res.send;

  // Overriding the res.send method to capture the response data
  res.send = function (data) {
    // Log the response body here
    logResponse(`Status: ${res.statusCode} | Body: ${data}`);

    // Call the original res.send method
    oldSend.apply(res, arguments);
  };

  next();
});

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
  console.log("🐱 MongoDB Connected 🐾"); // Just a simple output
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => console.error("💥 Mongo Error:", err));

// Example of logging all requests creatively
app.use((req, res, next) => {
  logRequest(`Method: ${req.method} | URL: ${req.originalUrl}`);
  next();
});

// Log response after finishing request
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    logResponse(`Status: ${res.statusCode} | Body: ${data}`);
    oldSend.apply(res, arguments);
  };
  next();
});
