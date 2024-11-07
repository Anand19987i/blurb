import express from "express";
import { googleLogin, login, logout, register } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/google-login").post(singleUpload, googleLogin);

export default router