export type ResourceRow = {
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
};

export type CommentRow = {
  comment_id: number;
  resource_id: number;
  user_name: string;
  comment_text: string;
  created_at: string;
};

export function renderResourceList(opts: {
  heading: string;
  resources: ResourceRow[];
  comments: CommentRow[];
  submitAction: string;
  commentAction: string;
  showSectionFields?: boolean;
}): string {
  const { heading, resources, comments, submitAction, commentAction, showSectionFields } = opts;

  const commentsByResource = comments.reduce<Record<number, CommentRow[]>>((acc, c) => {
    if (!acc[c.resource_id]) {
      acc[c.resource_id] = [];
    }
    acc[c.resource_id]!.push(c);
    return acc;
  }, {});

  const resourcesHtml =
    resources.length === 0
      ? "<p>No resources yet.</p>"
      : `<table>
          <thead>
            <tr>
              <th>Title</th>
              ${showSectionFields ? "<th>Course</th><th>Section</th>" : ""}
              <th>Type</th>
              <th>Avg Rating</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            ${resources
              .map(
                (r) => `
                  <tr>
                    <td><a href="${r.resource_url}" target="_blank" rel="noreferrer">${r.title}</a><br/><small>${r.description}</small></td>
                    ${showSectionFields ? `<td>${r.section_id}</td><td>${r.group_id ?? ""}</td>` : ""}
                    <td>${r.resource_type}</td>
                    <td>${
                      r.avg_rating === null || Number.isNaN(Number(r.avg_rating))
                        ? "—"
                        : Number(r.avg_rating).toFixed(1)
                    }</td>
                    <td>${new Date(r.uploaded_at).toLocaleDateString()} by ${r.uploader_name}</td>
                  </tr>
                  <tr>
                    <td colspan="${showSectionFields ? 5 : 4}">
                      <strong>Comments</strong>
                      ${
                        (commentsByResource[r.resource_id] ?? [])
                          .map(
                            (c) =>
                              `<div class="comment-row"><strong>${c.user_name}</strong>: ${c.comment_text} <small>${new Date(
                                c.created_at
                              ).toLocaleDateString()}</small></div>`
                          )
                          .join("") || "<div>No comments</div>"
                      }
                      <form method="POST" action="${commentAction}">
                        <input type="hidden" name="resource_id" value="${r.resource_id}" />
                        <label>
                          Comment
                          <input type="text" name="comment_text" required />
                        </label>
                        <label>
                          User ID
                          <input type="number" name="user_id" required />
                        </label>
                        <label>
                          Rating (1-5, required)
                          <input type="number" name="rating" min="1" max="5" required />
                        </label>
                        <button type="submit">Add Comment</button>
                      </form>
                    </td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>`;

  const body = `
    <section>
      <h2>${heading}</h2>
      ${resourcesHtml}
    </section>

    <section>
      <h3>Add Resource</h3>
      <form method="POST" action="${submitAction}">
        <label>
          Title
          <input type="text" name="title" required />
        </label>
        <label>
          Description
          <input type="text" name="description" required />
        </label>
        <label>
          Type
          <input type="text" name="resource_type" required />
        </label>
        <label>
          URL
          <input type="url" name="resource_url" required />
        </label>
        <label>
          Uploader ID
          <input type="number" name="uploader_id" required />
        </label>
        <button type="submit">Create Resource</button>
      </form>
    </section>
  `;

  return body;
}