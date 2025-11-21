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
        <li><a href="/sections/1/resources">Browse Section 1 Library</a></li>
        <li><a href="/resources/new">Upload a New Resource</a></li>
        <li><a href="/analytics/top-courses">View Top Courses</a></li>
        <li><a href="/analytics/top-contributors">View Top Contributors</a></li>
      </ul>
    </section>
  `;
  return renderLayout("ZagNotes - Home", body);
}
