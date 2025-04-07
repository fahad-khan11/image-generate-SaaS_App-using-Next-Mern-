const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, please login again"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || '12343dgd');

        req.body.userId = decodedToken.id;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, please login again"
        });
    }
};

module.exports = userAuth;
