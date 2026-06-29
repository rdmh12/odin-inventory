import * as db from "../db/queries.js";

export async function index(req, res) {
  const lowOnStockItems = await db.getItemsLowOnStock(10);
  const missingInfoItems = await db.getItemsWithMissingInfo();
  const recentItems = await db.getItemsRecentlyUpdated(5);

  res.render("index", {
    content: "dashboard",
    selectedPage: "dashboard",
    lowOnStockItems,
    missingInfoItems,
    recentItems,
  });
}
