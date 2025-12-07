import express from "express";
import path from "path";
import usersRouter from "./routes/users.js";
import sectionsRouter from "./routes/sections.js";
import resourcesRouter from "./routes/resources.js";
import groupsRouter from "./routes/groups.js";
import topResourcesRouter from "./routes/top_resources.js";
import topContributorsRouter from "./routes/top_contributors.js";
import { fileURLToPath } from "url";
import { renderHome } from "./views/home.js";

// esm doesn't have __dirname, so i made it myself
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware to parse form and json bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// home page
app.get("/", (req, res) => {
  const html = renderHome();
  res.send(html);
});

// mount routers (will implement routes later)
app.use("/users", usersRouter);
app.use("/sections", sectionsRouter);
app.use("/resources", resourcesRouter);
app.use("/groups", groupsRouter);
app.use("/analytics/top-resources", topResourcesRouter);
app.use("/analytics/top-contributors", topContributorsRouter);

export default app;
