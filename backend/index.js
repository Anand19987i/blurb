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
    origin: 'https://blurb-azo3.onrender.com',  // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // Allow credentials (cookies, etc.)
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://blurb-azo3.onrender.com');  // Set exact origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});


app.use(cors(corsOptions));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server is listening at ${port}`);
});
// https://blurb-azo3.onrender.com