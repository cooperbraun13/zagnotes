import express from "express";
import path from "path";
import { renderHome } from "./views/home.js";

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

export default app;
