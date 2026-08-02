import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (_req, res) => {
    res.send("OriginChain backend is running.");
});

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});