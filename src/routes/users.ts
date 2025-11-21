import { Router } from "express";
import { query } from "../db.js";
import { renderUserList, renderUserCreateForm } from "./users.js";

const router = Router();

// list users
router.get("/", async (req, res) => {
  try {
    const users = await query<{
      user_id: number;
      first_name: string;
      last_name: string;
      zagmail: string;
      created_at: string;
    }>(`
      SELECT user_id, first_name, last_name, zagmail, created_at 
      FROM user_account 
      ORDER BY created_at DESC
    `);
    const html = renderUserList(users);
    res.send(html);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// show create-user form
router.get("/new", (req, res) => {
  const html = renderUserCreateForm();
  res.send(html);
});

// handle create-user form submission
router.post("/", async (req, res) => {
  const { first_name, last_name, zagmail } = req.body;

  try {
    await query(
      `
      INSERT INTO user_account(first_name, last_name, zagmail)
      VALUES ($1, $2, $3)
      `,
      [first_name, last_name, zagmail]
    );
    res.redirect("/users");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;