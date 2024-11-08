import express from "express";
import { googleLogin, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

