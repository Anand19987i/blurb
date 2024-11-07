import express from "express";
import { getUserProfile, login, logout, register } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id").get(getUserProfile); 

export default router