import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./utils/seedData.js";

const PORT = config.port || 8080;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CAR DEALS CMS ENTERPRISE ERP BACKEND RUNNING`);
  console.log(`🌐 Environment: ${config.nodeEnv}`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Paystack Public Key Loaded: ${config.paystack.publicKey ? "YES" : "NO"}`);
  console.log(`🔒 RBAC & Security Active: Helmet, CORS, RateLimiter, MongoSanitize`);
  console.log(`=======================================================`);
});

// Connect to MongoDB Atlas in background and seed initial dataset
connectDB().then(async () => {
  await seedDatabase();
}).catch((err) => {
  console.error("⚠️ Initial database connection attempt failed:", err.message);
});

export default server;
