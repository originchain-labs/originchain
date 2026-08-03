import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.get("/", (_req, res) => {
    res.send("OriginChain backend is running.");
});

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});