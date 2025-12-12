import { renderLayout } from "./layout.js";

export function renderHome(): string {
  const body = `
    <section>
      <h2>Welcome to ZagNotes</h2>
      <p>
        Share and discover course notes, study resources, and study groups across Gonzaga.
      </p>
    </section>

    <section>
      <h3>Quick Actions</h3>
      <ul>
        <li><a href="/sections">Browse Sections</a></li>
        <li><a href="/groups">Browse Study Groups</a></li>
        <li><a href="/users">Browse Users</a></li>
        <li><a href="/analytics/top-resources">View Top Resources</a></li>
        <li><a href="/analytics/top-contributors">View Top Contributors</a></li>
      </ul>
    </section>
  `;
  return renderLayout("ZagNotes - Home", body);
}
