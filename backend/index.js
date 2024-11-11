import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import isAuthenticated from "./middlewares/isAuthenticated.js";

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
app.use("/api/v1/post", postRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is listening at ${port}`)
})