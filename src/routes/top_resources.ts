import { Router } from "express";
import { query } from "../db.js";
import { renderTopResources } from "../views/top_resources.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const resources = await query<{
      title: string;
      avg_rating: number;
      course_code: string;
      section_code: string;
      uploader: string;
    }>(
      `
      SELECT r.title,
             AVG(rt.rating) AS avg_rating,
             s.course_code,
             s.section_code,
             ua.first_name || ' ' || ua.last_name AS uploader
      FROM resource r
      JOIN section s ON s.section_id = r.section_id
      JOIN user_account ua ON ua.user_id = r.uploader_id
      JOIN rating rt ON rt.resource_id = r.resource_id
      WHERE r.is_deleted = FALSE
      GROUP BY r.resource_id, s.course_code, s.section_code, ua.first_name, ua.last_name
      HAVING AVG(rt.rating) >= 4
      ORDER BY AVG(rt.rating) DESC
      LIMIT 10
      `
    );
    res.send(renderTopResources(resources));
  } catch (error) {
    console.error("Error fetching top resources:", error);
    res.status(500).json({ error: "Failed to fetch top resources" });
  }
});

export default router;

