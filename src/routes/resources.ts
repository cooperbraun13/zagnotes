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

export default router;
