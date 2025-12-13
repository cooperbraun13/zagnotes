import { Router } from "express";
import { query } from "../db.js";

const router = Router();

// create resource under a section
router.post("/section/:sectionId", async (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const { title, description, resource_type, resource_url, uploader_id } = req.body;
  if (Number.isNaN(sectionId)) {
    res.status(400).send("Invalid section id");
    return;
  }
  try {
    await query(
      `
      INSERT INTO resource(section_id, uploader_id, title, description, resource_type, resource_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [sectionId, uploader_id, title, description, resource_type, resource_url]
    );
    res.redirect(`/sections/${sectionId}`);
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// create resource under a study group
router.post("/group/:groupId", async (req, res) => {
  const groupId = Number(req.params.groupId);
  const { section_id, title, description, resource_type, resource_url, uploader_id } = req.body;
  if (Number.isNaN(groupId)) {
    res.status(400).send("Invalid group id");
    return;
  }
  try {
    await query(
      `
      INSERT INTO resource(section_id, uploader_id, title, description, resource_type, resource_url, group_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [section_id, uploader_id, title, description, resource_type, resource_url, groupId]
    );
    res.redirect(`/groups/${groupId}`);
  } catch (error) {
    console.error("Error creating group resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
});

// add comment for section resource
router.post("/section/:sectionId/comments", async (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const { resource_id, user_id, comment_text, rating } = req.body;
  try {
    const ratingValue = Number(rating);
    if (!rating || Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      res.status(400).send("Rating must be between 1 and 5 when commenting");
      return;
    }

    // ensure a rating is recorded
    await query(
      `
      INSERT INTO rating(resource_id, user_id, rating)
      VALUES ($1, $2, $3)
      `,
      [resource_id, user_id, ratingValue]
    );

    await query(
      `
      INSERT INTO comment(resource_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      `,
      [resource_id, user_id, comment_text]
    );
    res.redirect(`/sections/${sectionId}`);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// add comment for group resource
router.post("/group/:groupId/comments", async (req, res) => {
  const groupId = Number(req.params.groupId);
  const { resource_id, user_id, comment_text, rating } = req.body;
  try {
    const ratingValue = Number(rating);
    if (!rating || Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      res.status(400).send("Rating must be between 1 and 5 when commenting");
      return;
    }

    await query(
      `
      INSERT INTO rating(resource_id, user_id, rating)
      VALUES ($1, $2, $3)
      `,
      [resource_id, user_id, ratingValue]
    );

    await query(
      `
      INSERT INTO comment(resource_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      `,
      [resource_id, user_id, comment_text]
    );
    res.redirect(`/groups/${groupId}`);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// flag a resource for moderation
router.post("/:resourceId/flag", async (req, res) => {
  const resourceId = Number(req.params.resourceId);
  const { flagger_user_id, reason } = req.body;
  if (Number.isNaN(resourceId)) {
    res.status(400).send("Invalid resource id");
    return;
  }
  try {
    await query(
      `
      INSERT INTO flag(resource_id, flagger_user_id, reason, status)
      VALUES ($1, $2, $3, 'pending')
      `,
      [resourceId, flagger_user_id, reason]
    );
    res.status(201).json({ message: "Resource flagged for moderation" });
  } catch (error) {
    console.error("Error flagging resource:", error);
    res.status(500).json({ error: "Failed to flag resource" });
  }
});

// remove a resource (soft delete)
router.delete("/:resourceId", async (req, res) => {
  const resourceId = Number(req.params.resourceId);
  const { deleted_by } = req.body;
  if (Number.isNaN(resourceId)) {
    res.status(400).send("Invalid resource id");
    return;
  }
  try {
    await query(
      `
      UPDATE resource
      SET is_deleted = TRUE,
          deleted_at = NOW(),
          deleted_by = $1
      WHERE resource_id = $2
      `,
      [deleted_by, resourceId]
    );
    res.status(200).json({ message: "Resource removed" });
  } catch (error) {
    console.error("Error removing resource:", error);
    res.status(500).json({ error: "Failed to remove resource" });
  }
});

// edit resource metadata and tags
router.put("/:resourceId", async (req, res) => {
  const resourceId = Number(req.params.resourceId);
  const { title, description, resource_type, resource_url, tag_ids } = req.body;
  if (Number.isNaN(resourceId)) {
    res.status(400).send("Invalid resource id");
    return;
  }
  try {
    // update resource metadata
    await query(
      `
      UPDATE resource
      SET title = $1,
          description = $2,
          resource_type = $3,
          resource_url = $4
      WHERE resource_id = $5
      `,
      [title, description, resource_type, resource_url, resourceId]
    );

    // update tags: remove existing and add new ones
    await query(
      `
      DELETE FROM resource_tag
      WHERE resource_id = $1
      `,
      [resourceId]
    );

    if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
      for (const tagId of tag_ids) {
        await query(
          `
          INSERT INTO resource_tag(resource_id, tag_id)
          VALUES ($1, $2)
          `,
          [resourceId, tagId]
        );
      }
    }

    res.status(200).json({ message: "Resource updated" });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
});

// faceted search for resources
router.get("/search", async (req, res) => {
  const { course_code, professor_name, resource_type, min_rating } = req.query;
  try {
    const resources = await query<{
      resource_id: number;
      title: string;
      description: string;
      resource_type: string;
      resource_url: string;
      uploaded_at: string;
      course_code: string;
      professor_name: string;
      uploader_name: string;
      avg_rating: number | null;
    }>(
      `
      SELECT r.resource_id,
             r.title,
             r.description,
             r.resource_type,
             r.resource_url,
             r.uploaded_at,
             s.course_code,
             s.professor_name,
             ua.first_name || ' ' || ua.last_name AS uploader_name,
             AVG(rt.rating) AS avg_rating
      FROM resource r
      JOIN section s ON s.section_id = r.section_id
      JOIN user_account ua ON ua.user_id = r.uploader_id
      LEFT JOIN rating rt ON rt.resource_id = r.resource_id
      WHERE r.is_deleted = FALSE
        AND ($1::text IS NULL OR s.course_code ILIKE '%' || $1::text || '%')
        AND ($2::text IS NULL OR s.professor_name ILIKE '%' || $2::text || '%')
        AND ($3::text IS NULL OR r.resource_type = $3::text)
      GROUP BY r.resource_id, s.course_code, s.professor_name, ua.first_name, ua.last_name
      HAVING ($4::int IS NULL OR AVG(rt.rating) >= $4::int)
      ORDER BY r.uploaded_at DESC
      LIMIT 15
      `,
      [
        course_code ? String(course_code) : null,
        professor_name ? String(professor_name) : null,
        resource_type ? String(resource_type) : null,
        min_rating ? Number(min_rating) : null,
      ]
    );
    res.json(resources);
  } catch (error) {
    console.error("Error searching resources:", error);
    res.status(500).json({ error: "Failed to search resources" });
  }
});

export default router;
