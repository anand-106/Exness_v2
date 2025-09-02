import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = "anand";

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "no token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    (req as any).email = (decoded as any).email;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
