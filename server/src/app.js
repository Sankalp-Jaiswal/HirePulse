import 'dotenv/config';
import express from "express";
import cors from "cors";
import rankingRoutes from "./routes/ranking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rank", rankingRoutes);

export default app;
