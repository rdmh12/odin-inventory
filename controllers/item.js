export function list(req, res) {
  res.render("index", {
    content: "item-list",
  });
}

export function createGet(req, res) {
  res.render("index", {
    content: "item-form",
    action: "create",
  });
}

export function createPost(req, res) {
  res.send("POST item-create");
}

export function detail(req, res) {
  res.render("index", {
    content: "item-detail",
    id: req.params.id,
  });
}

export function editGet(req, res) {
  res.render("index", {
    content: "item-form",
    action: "edit",
  });
}

export function editPost(req, res) {
  res.send("POST item-edit");
}

export function deletePost(req, res) {
  res.send("POST item-delete");
}
