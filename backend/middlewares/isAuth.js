import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        console.log("TOKEN:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = verifyToken.userId;

        next();

    } catch (error) {

        console.log("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or malformed token"
        });
    }
};

export default isAuth;