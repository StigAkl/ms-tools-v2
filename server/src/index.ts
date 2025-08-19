import { Player } from "./models";
import fs from "fs";
import { analyzeEvent } from "./eventsUtils";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const players = new Map<string, Player>();

const filePath = path.join(import.meta.dirname, "data", "events.txt");

for (const line of fs.readFileSync(filePath, "utf-8").split("\n")) {
  analyzeEvent(line, players);
}

fs.writeFileSync(
  path.join(import.meta.dirname, "data", "data.json"),
  JSON.stringify(Array.from(players.values()), null, 2),
  "utf-8"
);

app.get("/api/v1/events", (req, res) => {
  const filePath = path.join(__dirname, "data", "data.json");
  const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(json); // 👈 dette returnerer JSON direkte
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
