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

// Middleware - CORS configuration for frontend domain
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions)); // Apply CORS with specific options

// Handle OPTIONS preflight requests (required for some CORS cases)
app.options('*', cors(corsOptions)); // Allow all OPTIONS preflight requests

// Middleware to parse JSON
app.use(express.json());

// Custom logging middleware using morgan
morgan.token("req-body", (req) => JSON.stringify(req.body)); // Log request body

// Custom function for logging requests in a clean format
const logRequest = (message) => {
  console.log(`REQUEST: ${message}`); // Clean format for incoming requests
};

const logResponse = (message) => {
  console.log(`RESPONSE: ${message}`); // Clean format for outgoing responses
};

// Log all incoming requests with the request body
app.use((req, res, next) => {
  logRequest(`Method: ${req.method} | URL: ${req.originalUrl} | Body: ${JSON.stringify(req.body)}`);
  next();
});

// Custom middleware to capture and log the response body after the request
app.use((req, res, next) => {
  let oldSend = res.send;

  // Overriding the res.send method to capture the response data
  res.send = function (data) {
    // Log the response body here, after the request
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
  console.log("MongoDB Connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error("MongoDB Error:", err));