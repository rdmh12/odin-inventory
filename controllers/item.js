import { body, param, validationResult, matchedData } from "express-validator";
import {
  redirectWithSuccess,
  redirectWithError,
  popMessage,
} from "../utils.js";

import * as db from "../db/queries.js";

export async function list(req, res) {
  const items = await db.getItemsWithCategories();
  const message = popMessage(req);

  render(res, "item-list", {
    items,
    message,
  });
}

export async function createGet(req, res) {
  const categories = await db.getCategories();

  return renderForm(res, {
    action: "create",
    categories,
  });
}

export async function createPost(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const item = matchedData(req, { onlyValidData: false });
    const categories = await db.getCategories();

    categories.forEach((category) => {
      category.selected =
        item.categories.find((id) => id == category.id) != undefined;
    });

    return renderForm(res, {
      action: "create",
      item,
      categories,
      errors: result.mapped(),
    });
  }

  const item = matchedData(req);

  try {
    const id = await db.insertItem(item, item.categories);

    return redirectWithSuccess(
      req,
      res,
      `/item/${id}`,
      "Item successfully created",
    );
  } catch (err) {
    return renderForm(res, {
      action: "create",
      item,
      message: { isError: true, text: `Database error: ${err.message}` },
    });
  }
}

export async function detail(req, res, next) {
  if (!validationResult(req).isEmpty()) next("route");

  try {
    const { id } = matchedData(req);
    const item = await db.getItem(id);

    if (item == null) next("route");

    const categories = await db.getItemCategories(id);
    const message = popMessage(req);

    render(res, "item-detail", {
      item,
      categories,
      message,
    });
  } catch {
    next("route");
  }
}

export async function editGet(req, res, next) {
  if (!validationResult(req).isEmpty()) return next("route");

  try {
    const { id } = matchedData(req);
    const item = await db.getItem(id);

    if (item == null) return next("route");

    const categories = await db.getCategoriesForItemWithSelection(id);

    return renderForm(res, {
      action: "edit",
      item,
      categories,
    });
  } catch (err) {
    return redirectWithError("/item", `Database error: ${err.message}`);
  }
}

export async function editPost(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const item = matchedData(req, { onlyValidData: false });
    const categories = await db.getCategories(item.id);

    categories.forEach((category) => {
      category.selected =
        item.categories.find((id) => id == category.id) != undefined;
    });

    return renderForm(res, {
      action: "edit",
      item,
      categories,
      errors: result.mapped(),
    });
  }

  const item = matchedData(req, { onlyValidData: false });

  try {
    await db.updateItem(item, item.categories);

    return redirectWithSuccess(req, res, `/item/${item.id}`, "Item saved");
  } catch (err) {
    const categories = await db.getCategories(item.id);

    categories.forEach((category) => {
      category.selected =
        item.categories.find((id) => id == category.id) != undefined;
    });

    return renderForm(res, {
      action: "edit",
      item,
      categories,
      errors: result.mapped(),
      message: { isError: true, text: `Database error: ${err.message}` },
    });
  }
}

export async function deletePost(req, res, next) {
  if (!validationResult(req).isEmpty()) return next("route");

  const { id } = matchedData(req);
  const itemName = req.body.name ?? "<unknown>";

  try {
    const result = await db.deleteItem(id);

    if (result.rowCount != 1) return next("route");

    return redirectWithSuccess(
      req,
      res,
      "/item",
      `Deleted item "${itemName}" (id: ${id})`,
    );
  } catch (err) {
    return redirectWithError(
      req,
      res,
      "/item",
      `Failed to delete item "${itemName}" (id: ${id}): ${err.message}`,
    );
  }
}

export const idValidator = [param("id").isInt({ min: 1 })];

export const itemValidator = [
  body("name").trim().not().isEmpty().withMessage('"Name" is required'),
  body("description").optional(),
  body("price")
    .isFloat({ min: 0 })
    .withMessage('"Price" must be a positive number')
    .optional({ checkFalsy: true }),
  body("in_stock")
    .isInt({ min: 0 })
    .withMessage('"In Stock" must be a positive number')
    .optional({ checkFalsy: true }),
  body("categories.*").isInt({ min: 1 }),
];

function render(res, content, locals) {
  res.render("index", {
    content,
    selectedPage: "item",
    ...locals,
  });
}

function renderForm(
  res,
  { action, item = {}, categories, errors = {}, message = null },
) {
  res.status(Object.keys(errors).length == 0 ? 200 : 400);

  render(res, "index", {
    content: "item-form",
    action,
    actionTarget: action == "create" ? "/item/create" : `/item/${item.id}/edit`,
    errors,
    message,
    categories,
    item: {
      name: "",
      description: "",
      price: "",
      in_stock: "",
      ...item,
    },
  });
}
