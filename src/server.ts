import app from "./app.js";

// port selection
const PORT = process.env.PORT || 3003;

// start the http server
app.listen(PORT, () => {
  console.log(`ZagNotes running at http://localhost:${PORT}`);
});
