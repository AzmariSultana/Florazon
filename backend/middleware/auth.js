import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  // Accept either Authorization: Bearer <token> or legacy 'token' header
  const authHeader = req.headers["authorization"];
  const legacyToken = req.headers["token"];

  let rawToken = legacyToken || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined);

  if (!rawToken) {
    return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
  }

  try {
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
    // attach to req (not body) so it works for GET as well
    req.userId = decoded.id;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;