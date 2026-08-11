import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { validateEnv } from "./config/env-validator.js";
import authRoutes from "./routes/auth.routes.js";
import creatorRoutes from "./routes/creator.routes.js";
import assetRoutes from "./routes/asset.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import searchRoutes from "./routes/search.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import opsRoutes from "./routes/ops.routes.js";
import { getHealth } from "./controllers/ops.controller.js";
import { startCreatorIndexer } from "./indexer/creator-indexer.js";
import { startAssetIndexer } from "./indexer/asset-indexer.js";
import { errorHandler } from "./middleware/errorHandler.js";

validateEnv();

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'none'"],
                frameAncestors: ["'none'"],
            },
        },
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(express.json());

app.get("/", (_req, res) => {
    res.send("OriginChain backend is running.");
});

// Root-level health probe for cloud platform liveness checks (e.g. Railway, K8s)
app.get("/health", getHealth);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", opsRoutes);
app.use("/api/v1/creators", creatorRoutes);
app.use("/api/v1/assets", assetRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/admin", adminRoutes);

// Register centralized error handler LAST
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});

startAssetIndexer();
startCreatorIndexer();
