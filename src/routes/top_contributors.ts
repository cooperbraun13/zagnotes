import { Router } from "express";
import { query } from "../db.js";
import { renderTopContributors } from "../views/top_contributors.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const contributors = await query<{
      uploader: string;
      upload_count: number;
      avg_rating: number | null;
    }>(
      `
      SELECT ua.first_name || ' ' || ua.last_name AS uploader,
             COUNT(r.resource_id) AS upload_count,
             AVG(rt.rating) AS avg_rating
      FROM resource r
      JOIN user_account ua ON ua.user_id = r.uploader_id
      LEFT JOIN rating rt ON rt.resource_id = r.resource_id
      WHERE r.is_deleted = FALSE
      GROUP BY ua.first_name, ua.last_name
      ORDER BY upload_count DESC
      LIMIT 10
      `
    );
    res.send(renderTopContributors(contributors));
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    res.status(500).json({ error: "Failed to fetch top contributors" });
  }
});

export default router;

