import { renderLayout } from "./layout.js";

export function renderTopResources(resources: {
  title: string;
  avg_rating: number;
  course_code: string;
  section_code: string;
  uploader: string;
}[]): string {
  const rows =
    resources.length === 0
      ? "<p>No resources yet.</p>"
      : `<table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Avg Rating</th>
              <th>Course</th>
              <th>Section</th>
              <th>Uploader</th>
            </tr>
          </thead>
          <tbody>
            ${resources
              .map(
                (r) => `
                  <tr>
                    <td>${r.title}</td>
                    <td>${r.avg_rating.toFixed(1)}</td>
                    <td>${r.course_code}</td>
                    <td>${r.section_code}</td>
                    <td>${r.uploader}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>`;

  return renderLayout("Top Resources", `<section><h2>Top Resources</h2>${rows}</section>`);
}