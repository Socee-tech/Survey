import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import surveyController from "./controllers/surveyController.js";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import authMiddleware from "./middleWare/authMiddleware.js";

dotenv.config();
connectDB();

const App = express();
App.use(cors());
App.use(express.json());

App.use("/api/auth", authRoutes);
App.use("/api/responses", authMiddleware, surveyController);
App.get("/", (req, res) => {
  res.send("API is running...");
});

export default App;

const PORT = process.env.PORT || 5000;

App.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
