import express from "express";
import { login, register } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login)

export default router