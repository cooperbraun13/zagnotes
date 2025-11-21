import { renderLayout } from "./layout.js";

export type UserRow = {
  user_id: number;
  first_name: string;
  last_name: string;
  zagmail: string;
  created_at: string;
};

export function renderUserList(users: UserRow[]): string {
  const rowsHtml =
    users.length === 0
      ? "<p>No users yet. Create one below</p>"
      : `<table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Zagmail</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user) => `
                  <tr>
                    <td>${user.user_id}</td>
                    <td>${user.first_name} ${user.last_name}</td>
                    <td>${user.zagmail}</td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                `
              )
              .join("")}
            </tbody>
          </table>`;

  const body = `
    <section>
      <h2>Users</h2>
        ${rowsHtml}
    </section>

    <section>
      <h3>Create New User</h3>
      ${renderUserCreateFormBody()}
    </section>
  `;

  return renderLayout("ZagNotes - Users", body);
}

function renderUserCreateFormBody(): string {
  return `
    <form method="POST" action="/users">
      <label>
        First Name:
        <input type="text" name="first_name" required />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" name="last_name" required />
      </label>
      <br />
      <label>
        Zagmail:
        <input type="email" name="zagmail" required />
      </label>
      <br />
      <button type="submit">Create User</button>
    </form>
  `;
}

export function renderUserCreateForm(): string {
  const body = `
    <section>
      <h2>Create a New User</h2>
      ${renderUserCreateFormBody()}
    </section>
  `;
  return renderLayout("ZagNotes - New User", body);
}