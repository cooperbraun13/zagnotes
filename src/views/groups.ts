import { renderLayout } from "./layout.js";

export type GroupRow = {
  group_id: number;
  name: string;
  description: string;
  owner_user_id: number;
};

export function renderGroupList(groups: GroupRow[]): string {
  const rows =
    groups.length === 0
      ? "<p>No study groups yet.</p>"
      : `<table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${groups
              .map(
                (g) => `
                  <tr>
                    <td>${g.name}</td>
                    <td>${g.description}</td>
                    <td>${g.owner_user_id}</td>
                    <td><a href="/groups/${g.group_id}">View</a></td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>`;

  const body = `
    <section>
      <h2>Study Groups</h2>
      ${rows}
    </section>

    <section>
      <h3>Create Group</h3>
      <form method="POST" action="/groups">
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Description
          <input type="text" name="description" required />
        </label>
        <label>
          Owner User ID
          <input type="number" name="owner_user_id" required />
        </label>
        <button type="submit">Create Group</button>
      </form>
    </section>
  `;

  return renderLayout("ZagNotes - Study Groups", body);
}

export function renderGroupDetail(group: GroupRow, resourcesHtml: string): string {
  const body = `
    <section>
      <h2>${group.name}</h2>
      <p>${group.description}</p>
      <p>Owner User ID: ${group.owner_user_id}</p>
    </section>
    ${resourcesHtml}
  `;
  return renderLayout(`Study Group - ${group.name}`, body);
}

