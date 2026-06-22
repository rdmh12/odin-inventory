import express from "express";
import path from "node:path";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("...");
});

const port = process.env.PORT ?? 3000;

app.listen(port, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`listening on port ${port}`);
  }
});
