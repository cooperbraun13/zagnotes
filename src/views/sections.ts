import { renderLayout } from "./layout.js";

export type SectionRow = {
  section_id: number;
  course_code: string;
  course_title: string;
  term: string;
  section_code: string;
  professor_name: string;
};

export function renderSectionList(sections: SectionRow[], filters: Record<string, string | undefined>): string {
  const rows =
    sections.length === 0
      ? "<p>No sections yet.</p>"
      : `<table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Title</th>
              <th>Term</th>
              <th>Section</th>
              <th>Professor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${sections
              .map(
                (s) => `
                  <tr>
                    <td>${s.course_code}</td>
                    <td>${s.course_title}</td>
                    <td>${s.term}</td>
                    <td>${s.section_code}</td>
                    <td>${s.professor_name}</td>
                    <td><a href="/sections/${s.section_id}">View</a></td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>`;

  const body = `
    <section>
      <h2>Sections</h2>
      <form method="GET" action="/sections" class="filter-form">
        <div class="filters">
          <label>
            Course Code
            <input type="text" name="course_code" value="${filters.course_code ?? ""}" />
          </label>
          <label>
            Professor
            <input type="text" name="professor_name" value="${filters.professor_name ?? ""}" />
          </label>
          <label>
            Term
            <input type="text" name="term" value="${filters.term ?? ""}" />
          </label>
          <button type="submit">Filter</button>
          <a href="/sections">Clear</a>
        </div>
      </form>
      ${rows}
    </section>

    <section>
      <h3>Create Section</h3>
      <form method="POST" action="/sections">
        <label>
          Course Code
          <input type="text" name="course_code" required />
        </label>
        <label>
          Course Title
          <input type="text" name="course_title" required />
        </label>
        <label>
          Term
          <input type="text" name="term" required />
        </label>
        <label>
          Section Code
          <input type="text" name="section_code" required />
        </label>
        <label>
          Professor
          <input type="text" name="professor_name" required />
        </label>
        <button type="submit">Create Section</button>
      </form>
    </section>
  `;

  return renderLayout("ZagNotes - Sections", body);
}

export function renderSectionDetail(section: SectionRow, resourcesHtml: string): string {
  const body = `
    <section>
      <h2>${section.course_code} - ${section.course_title}</h2>
      <p>Term: ${section.term}</p>
      <p>Section: ${section.section_code}</p>
      <p>Professor: ${section.professor_name}</p>
    </section>

    ${resourcesHtml}
  `;

  return renderLayout(`ZagNotes - ${section.course_code}`, body);
}

