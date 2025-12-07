import { Router } from "express";
import { query } from "../db.js";
import {} from "../views/resources.js";

const router = Router();

// list all sections
router.get("/", async (req, res) => {
  try {
    console.log("Attempting to fetch resources from database...");
    const sections = await query<{
      section_id: number;
      course_id: number;
      section_code: number;
      term: string;
      prof_name: string;
    }>(`
      SELECT section_id, course_id, section_code, term, prof_name 
      FROM section 
      ORDER BY created_at DESC
    `);
    const html = renderSectionList(sections);
    res.send(html);
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({
      error: "Failed to fetch sections",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// show create-section form
router.get("/new", (req, res) => {
  const html = renderSectionCreateForm();
  res.send(html);
});

// handle create-section form submission
router.post("/", async (req, res) => {
  const { section_code, term, prof_name } = req.body;

  try {
    await query(
      `
      INSERT INTO section(section_code, term, prof_name)
      VALUES ($1, $2, $3)
      `,
      [section_code, term, prof_name]
    );
    res.redirect("/sections");
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ error: "Failed to create section" });
  }
});

export default router;
