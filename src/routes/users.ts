import { Router } from "express";
import { query } from "../db.js";
import { renderUserList, renderUserCreateForm } from "../views/users.js";

const router = Router();

// GET /users
// fetch all users from the database, newest first, then render the list view
router.get("/", async (req, res) => {
  try {
    console.log("Attempting to fetch users from database...");
    const users = await query<{
      user_id: number;
      first_name: string;
      last_name: string;
      zagmail: string;
      major: string;
      created_at: string;
    }>(`
      SELECT user_id, first_name, last_name, zagmail, major, created_at 
      FROM user_account 
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // server-render the html list
    const html = renderUserList(users);
    res.send(html);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users", details: error instanceof Error ? error.message : String(error) });
  }
});

// GET /users/new
// render the 'create user' form
router.get("/new", (req, res) => {
  const html = renderUserCreateForm();
  res.send(html);
});

// POST /users
// accepts form submission to create a new user; then redirects back to /users
router.post("/", async (req, res) => {
  const { first_name, last_name, zagmail, major } = req.body;

  try {
    await query(
      `
      INSERT INTO user_account(first_name, last_name, zagmail, major)
      VALUES ($1, $2, $3, $4)
      `,
      [first_name, last_name, zagmail, major]
    );

    // after creation, use post/redirect/get pattern to avoid duplicate submissions
    res.redirect("/users");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;