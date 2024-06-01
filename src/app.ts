import express, { Response } from "express";
import cors from "cors";
import morganMiddleware from "@/config/morgan-config";

const app = express();

app.use(cors());
app.use(morganMiddleware);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res: Response) => {
  res.send("Hello from your Api server!");
});




export default app