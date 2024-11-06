import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoute from "./routes/user.route.js"

dotenv.config({});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptipn = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(cors(corsOptipn));
app.use("/api/v1/user", userRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is listening at ${port}`)
})