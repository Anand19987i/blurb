import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token)
        return res.status(401).json({message: "Not authenticated, no token"});

    try {
        const decoded = jwt.verify(token, process.env.SecretKey);
        req.user = decoded.id;
        next();
    } catch(err) {
        res.status(401).json({message: "Token is invalid"});
    }
}

export default isAuthenticated;