import { renderLayout } from "./layout.js";

export function renderTopContributors(contributors: {
  uploader: string;
  upload_count: number;
  avg_rating: number | null;
}[]): string {
  const rows =
    contributors.length === 0
      ? "<p>No contributors yet.</p>"
      : `<table>
          <thead>
            <tr>
              <th>User</th>
              <th>Uploads</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            ${contributors
              .map(
                (c) => `
                  <tr>
                    <td>${c.uploader}</td>
                    <td>${c.upload_count}</td>
                    <td>${
                      c.avg_rating === null || Number.isNaN(Number(c.avg_rating))
                        ? "—"
                        : Number(c.avg_rating).toFixed(1)
                    }</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>`;

  return renderLayout("Top Contributors", `<section><h2>Top Contributors</h2>${rows}</section>`);
}