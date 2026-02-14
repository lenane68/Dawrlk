import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";


const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dawrlk-backend" });
});

app.use("/api", routes);

export default app;
