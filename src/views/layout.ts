export function renderLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="stylesheet" href="/public/css/styles.css" />
  </head>
  <body>
    <header>
      <h1>ZagNotes</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/users">Users</a>
        <a href="/sections/1/resources">Section Library</a>
        <a href="/resources/search">Search</a>
        <a href="/analytics/top-courses">Top Courses</a>
        <a href="/analytics/top-contributors">Top Contributors</a>
      </nav>
      <hr />
    </header>

    <main>
      ${body}
    </main>
  </body>
</html>`;
}
