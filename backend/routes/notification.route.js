import express from "express"
import { getNotifications } from "../controllers/notification.controller.js"

const router = express.Router();

router.route("/b/notifications/:userId").get(getNotifications);

export default router;

