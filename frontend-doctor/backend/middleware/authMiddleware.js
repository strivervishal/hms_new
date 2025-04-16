const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure `doctorId` is correctly extracted
    req.doctorId = decoded.doctorId;
    
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
