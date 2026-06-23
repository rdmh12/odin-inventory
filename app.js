import express from "express";
import session from "express-session";
import path from "node:path";

import dashboardRouter from "./routes/dashboard.js";
import categoryRouter from "./routes/category.js";
import itemRouter from "./routes/item.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use("/", dashboardRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);

app.use((req, res) => {
  res.status(404).render("index", {
    content: "404",
  });
});

const port = process.env.PORT ?? 3000;

app.listen(port, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`listening on port ${port}`);
  }
});
