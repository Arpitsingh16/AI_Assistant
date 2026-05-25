import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        const token = authHeader.split(" ")[1];

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
            message: "Invalid token"
        });
    }
};

export default isAuth;