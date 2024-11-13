import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";

dotenv.config({});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'https://blurb-azo3.onrender.com', // replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed methods
    credentials: true, // allow cookies if needed
};

app.use(cors(corsOptions));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is listening at ${port}`);
});
// https://blurb-azo3.onrender.com