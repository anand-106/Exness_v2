import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import tradeRouter from "./Routes/trades";
import sgMail from "@sendgrid/mail";
import { AuthMiddleware } from "./jwt";
import { creteBalance } from "./utils/pushOrder";
import { v4 as uuidv4 } from "uuid";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const PORT = 4000;
const JWT_SECRET = "anand";

const app = express();

app.use(express.json());
app.use(cookieParser());

type userData = {
  email: string;
  userId: string;
};

app.get("/", (req, res) => {
  res.json("hello world");
});

app.post("/api/v1/signup", (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ email }, JWT_SECRET);

  const LINK = `http://localhost:3000/auth/verify?token=${token}`;

  try {
    sgMail.send({
      from: "anands2003106@gmail.com",
      to: email,
      subject: "magiclink",
      html: `<a href=${LINK} > MagicLink</a>`,
    });
    console.log("email send");
    res.json({ message: "email sent" });
  } catch (e) {
    console.error(e);
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ id: email }, JWT_SECRET);

  const LINK = `http://localhost:3000/auth/verify?token=${token}`;

  try {
    await sgMail.send({
      from: "anands2003106@gmail.com",
      to: email,
      subject: "magiclink",
      html: `<a href=${LINK} > MagicLink</a>`,
    });
    console.log("email send");
    res.json({ message: "email sent" });
  } catch (e) {
    console.error(e);
  }
});

app.get("/api/v1/verify", async (req, res) => {
  const { token } = req.query;

  const { id } = jwt.verify(token as string, JWT_SECRET) as any;

  if (!id) res.status(401).json({ message: "Invalid token" });

  res.setHeader("Set-Cookie", `token=${token}; Max-Age=3600`); // Cookie expires in 1 hour
  res.send("Cookie set successfully");

  //   res.cookie("token", token);
  //   res.json({ email });
});

app.use(AuthMiddleware);

app.use("/api/v1/trade", tradeRouter);

app.listen(PORT, () => {
  console.log("app running on port ", PORT);
});
