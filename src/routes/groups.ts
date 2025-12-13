import { Router } from "express";
import { query } from "../db.js";
import { renderResourceList } from "../views/resources.js";
import { renderGroupDetail, renderGroupList, type GroupRow } from "../views/groups.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const groups = await query<GroupRow>(
      `
      SELECT group_id, name, description, owner_user_id
      FROM study_group
      ORDER BY created_at DESC
      LIMIT 15
      `
    );
    res.send(renderGroupList(groups));
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// create group
router.post("/", async (req, res) => {
  const { name, description, owner_user_id } = req.body;
  try {
    await query(
      `
      INSERT INTO study_group(name, description, owner_user_id)
      VALUES ($1, $2, $3)
      `,
      [name, description, owner_user_id]
    );
    res.redirect("/groups");
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// group detail with resources
router.get("/:groupId", async (req, res) => {
  const groupId = Number(req.params.groupId);
  if (Number.isNaN(groupId)) {
    res.status(400).send("Invalid group id");
    return;
  }
  try {
    const [group] = await query<GroupRow>(
      `
      SELECT group_id, name, description, owner_user_id
      FROM study_group
      WHERE group_id = $1
      `,
      [groupId]
    );
    if (!group) {
      res.status(404).send("Group not found");
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
      WHERE r.group_id = $1 AND r.is_deleted = FALSE
      GROUP BY r.resource_id, ua.first_name, ua.last_name
      ORDER BY r.uploaded_at DESC
      LIMIT 15
      `,
      [groupId]
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
      WHERE r.group_id = $1
      ORDER BY c.created_at DESC
      LIMIT 20
      `,
      [groupId]
    );

    const resourcesHtml = renderResourceList({
      heading: `Resources for ${group.name}`,
      resources,
      comments,
      submitAction: `/resources/group/${groupId}`,
      commentAction: `/resources/group/${groupId}/comments`,
    });

    res.send(renderGroupDetail(group, resourcesHtml));
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Failed to fetch group" });
  }
});

// remove a group member
router.delete("/:groupId/members/:userId", async (req, res) => {
  const groupId = Number(req.params.groupId);
  const userId = Number(req.params.userId);
  if (Number.isNaN(groupId) || Number.isNaN(userId)) {
    res.status(400).send("Invalid group id or user id");
    return;
  }
  try {
    await query(
      `
      DELETE FROM study_group_member
      WHERE group_id = $1 AND user_id = $2
      `,
      [groupId, userId]
    );
    res.status(200).json({ message: "Member removed from group" });
  } catch (error) {
    console.error("Error removing group member:", error);
    res.status(500).json({ error: "Failed to remove group member" });
  }
});

// change a group member's role
router.put("/:groupId/members/:userId/role", async (req, res) => {
  const groupId = Number(req.params.groupId);
  const userId = Number(req.params.userId);
  const { role } = req.body;
  if (Number.isNaN(groupId) || Number.isNaN(userId)) {
    res.status(400).send("Invalid group id or user id");
    return;
  }
  if (!role || !["owner", "member"].includes(role)) {
    res.status(400).send("Role must be 'owner' or 'member'");
    return;
  }
  try {
    await query(
      `
      UPDATE study_group_member
      SET role = $1
      WHERE group_id = $2 AND user_id = $3
      `,
      [role, groupId, userId]
    );
    res.status(200).json({ message: "Member role updated" });
  } catch (error) {
    console.error("Error updating member role:", error);
    res.status(500).json({ error: "Failed to update member role" });
  }
});

export default router;

