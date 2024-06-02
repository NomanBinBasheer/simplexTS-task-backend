import express, { Response } from "express";
import cors from "cors";
import morganMiddleware from "@/config/morgan-config";

///////////////  Import Routes  ////////////////////
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(morganMiddleware);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res: Response) => {
  res.send("Hello from your Api server!");
});

///////////////  Routes Decleration  ////////////////////

app.use("/api/v1/products", productRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)

export default app