import jwt from "jsonwebtoken";
export const authVerifier = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  token = token.split(" ").pop();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ message: "Bad Request" });
  }
};
