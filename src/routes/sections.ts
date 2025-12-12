import { Router } from "express";
import { query } from "../db.js";
import { renderSectionDetail, renderSectionList, type SectionRow } from "../views/sections.js";
import { renderResourceList } from "../views/resources.js";

const router = Router();

// list sections with filters
router.get("/", async (req, res) => {
  const { course_code, professor_name, term } = req.query;
  try {
    const sections = await query<SectionRow>(
      `
      SELECT section_id, course_code, course_title, term, section_code, professor_name
      FROM section
      WHERE ($1::text IS NULL OR course_code ILIKE '%' || $1::text || '%')
        AND ($2::text IS NULL OR professor_name ILIKE '%' || $2::text || '%')
        AND ($3::text IS NULL OR term ILIKE '%' || $3::text || '%')
      ORDER BY created_at DESC
      LIMIT 15
      `,
      [
        course_code ? String(course_code) : null,
        professor_name ? String(professor_name) : null,
        term ? String(term) : null,
      ]
    );
    const html = renderSectionList(sections, {
      course_code: course_code ? String(course_code) : undefined,
      professor_name: professor_name ? String(professor_name) : undefined,
      term: term ? String(term) : undefined,
    });
    res.send(html);
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
});

// create section
router.post("/", async (req, res) => {
  const { course_code, course_title, term, section_code, professor_name } = req.body;
  try {
    await query(
      `
      INSERT INTO section(course_code, course_title, term, section_code, professor_name)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [course_code, course_title, term, section_code, professor_name]
    );
    res.redirect("/sections");
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ error: "Failed to create section" });
  }
});

// section detail + resources
router.get("/:sectionId", async (req, res) => {
  const sectionId = Number(req.params.sectionId);
  if (Number.isNaN(sectionId)) {
    res.status(400).send("Invalid section id");
    return;
  }
  try {
    const [section] = await query<SectionRow>(
      `
      SELECT section_id, course_code, course_title, term, section_code, professor_name
      FROM section
      WHERE section_id = $1
      `,
      [sectionId]
    );
    if (!section) {
      res.status(404).send("Section not found");
      return;
    }

    const resources = await query<{
      resource_id: number;
      section_id: number;
      group_id: number | null;
      title: string;
      description: string;
      resource_type: string;
      resource_url: string;
      uploaded_at: string;
      uploader_name: string;
      avg_rating: number | null;
    }>(
      `
      SELECT r.resource_id,
             r.section_id,
             r.group_id,
             r.title,
             r.description,
             r.resource_type,
             r.resource_url,
             r.uploaded_at,
             ua.first_name || ' ' || ua.last_name AS uploader_name,
             AVG(rt.rating) AS avg_rating
      FROM resource r
      JOIN user_account ua ON ua.user_id = r.uploader_id
      LEFT JOIN rating rt ON rt.resource_id = r.resource_id
      WHERE r.section_id = $1 AND r.is_deleted = FALSE
      GROUP BY r.resource_id, ua.first_name, ua.last_name
      ORDER BY r.uploaded_at DESC
      LIMIT 15
      `,
      [sectionId]
    );

    const comments = await query<{
      comment_id: number;
      resource_id: number;
      user_name: string;
      comment_text: string;
      created_at: string;
    }>(
      `
      SELECT c.comment_id,
             c.resource_id,
             ua.first_name || ' ' || ua.last_name AS user_name,
             c.comment_text,
             c.created_at
      FROM comment c
      JOIN user_account ua ON ua.user_id = c.user_id
      JOIN resource r ON r.resource_id = c.resource_id
      WHERE r.section_id = $1
      ORDER BY c.created_at DESC
      LIMIT 20
      `,
      [sectionId]
    );

    const resourcesHtml = renderResourceList({
      heading: "Resources",
      resources,
      comments,
      submitAction: `/resources/section/${sectionId}`,
      commentAction: `/resources/section/${sectionId}/comments`,
    });
    const html = renderSectionDetail(section, resourcesHtml);
    res.send(html);
  } catch (error) {
    console.error("Error fetching section detail:", error);
    res.status(500).json({ error: "Failed to fetch section" });
  }
});

export default router;

