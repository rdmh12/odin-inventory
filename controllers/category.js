import { body, param, validationResult, matchedData } from "express-validator";
import { redirectWithSuccess, redirectWithError } from "../utils.js";
import * as db from "../db/queries.js";

export async function list(req, res) {
  const categories = await db.getCategoriesList();
  const message = req.session.message;

  delete req.session.message;

  res.status(message && message.isError ? 400 : 200);
  res.render("index", {
    content: "category-list",
    categories,
    message,
  });
}

export function createGet(req, res) {
  renderCategoryForm(res, {
    actionType: "create",
    actionTarget: "/category/create",
    category: {},
    errors: [],
  });
}

export async function createPost(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return renderCategoryForm(res, {
      actionType: "create",
      actionTarget: "/category/create",
      category: {},
      errors: errors.array(),
    });
  }

  const { name } = matchedData(req);

  try {
    const result = await db.insertCategory({ name });
    const { id } = result.rows[0];

    return redirectWithSuccess(
      req,
      res,
      `/category/${id}`,
      `Created category "${name}" (id: ${id})`,
    );
  } catch (err) {
    return renderCategoryForm(res, {
      actionType: "create",
      actionTarget: "/category/create",
      category: { name },
      errors: [{ msg: err.message }],
    });
  }
}

export async function detail(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return next("route");

  const { id } = matchedData(req);
  const rows = await db.getCategory(id);

  if (rows.length == 0) return next("route");

  const category = rows[0];
  const items = await db.getItemsForCategory(id);
  const message = req.session.message;

  delete req.session.message;

  res.status(message && message.isError ? 400 : 200);
  res.render("index", {
    content: "category-detail",
    message,
    category,
    items,
  });
}

export async function editGet(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return next("route");

  const { id } = matchedData(req);
  const rows = await db.getCategory(id);

  if (rows.length == 0) return next("route");

  return renderCategoryForm(res, {
    actionType: "edit",
    actionTarget: `/category/${id}/edit`,
    category: rows[0],
    errors: [],
  });
}

export async function editPost(req, res, next) {
  const errors = validationResult(req);
  const { id, name } = matchedData(req);

  if (!errors.isEmpty()) {
    return renderCategoryForm(res, {
      actionType: "edit",
      actionTarget: `/category/${id}/edit`,
      category: { name },
      errors: errors.array(),
    });
  }

  try {
    const result = await db.updateCategory(id, { name });

    if (result.rowCount == 0) return next("route");

    return redirectWithSuccess(
      req,
      res,
      `/category/${id}`,
      `Updated category "${name}" (id: ${id})`,
    );
  } catch (err) {
    return renderCategoryForm(res, {
      actionType: "edit",
      actionTarget: `/category/${id}/edit`,
      category: { name },
      errors: [{ msg: err.message }],
    });
  }
}

export async function deletePost(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return next("route");

  const { id } = matchedData(req);
  const categoryName = req.body.categoryName;
  const categoryNameFormatted = `${categoryName ? `"${categoryName}"` : ""} (id: ${id})`;

  try {
    const result = await db.deleteCategory(id);

    if (result.rowCount != 1) return next("route");

    return redirectWithSuccess(
      req,
      res,
      "/category",
      `Removed category ${categoryNameFormatted} `,
    );
  } catch (err) {
    return redirectWithError(req, res, "/category", err.message);
  }
}

export const idValidator = [param("id").isInt({ min: 1 })];

export const categoryValidator = [
  body("name").trim().not().isEmpty().withMessage("Category name is required"),
];

function renderCategoryForm(
  res,
  { actionType, actionTarget, category, errors },
) {
  const status = errors.length > 0 ? 400 : 200;

  res.status(status).render("index", {
    content: "category-form",
    actionType,
    actionTarget,
    category,
    errors,
  });
}
