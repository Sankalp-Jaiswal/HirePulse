import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rankingRoutes from "./routes/ranking.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rank", rankingRoutes);

export default app;
