export function list(req, res) {
  res.render("index", {
    content: "category-list",
  });
}

export function createGet(req, res) {
  res.render("index", {
    content: "category-form",
    action: "create",
  });
}

export function createPost(req, res) {
  res.send(`POST category-create`);
}

export function detail(req, res) {
  res.render("index", {
    content: "category-detail",
    id: req.params.id,
  });
}

export function editGet(req, res) {
  res.render("index", {
    content: "category-form",
    action: "edit",
  });
}

export function editPost(req, res) {
  res.send(`POST category-edit`);
}

export function deletePost(req, res) {
  res.send(`POST category-delete`);
}
