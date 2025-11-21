import app from "./app.js";

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`ZagNotes running at http://localhost:${PORT}`);
});
