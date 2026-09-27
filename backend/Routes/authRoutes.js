import express from "express";
import { createAdmin, loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/create", createAdmin);

export default router;