import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SecretKey;

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,  // Set to true in production with HTTPS
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week
};

export const setAuthToken = (user, res) => {
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Set the token as a cookie
    res.cookie('auth_token', token, COOKIE_OPTIONS);
};
