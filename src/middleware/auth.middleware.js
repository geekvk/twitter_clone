export const protectRoute = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.auth = auth; // attach to request for later use
  next();
};