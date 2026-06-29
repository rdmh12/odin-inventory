import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE,
});

export async function getCategoriesList() {
  const sql = `
    select id, name, count(item_id) as item_count
    from category
    left join item_category on category.id = category_id
    group by id
    order by name;`;

  const { rows } = await pool.query(sql);
  return rows;
}

export async function getCategories() {
  const sql = `
    select id, name
    from category
    order by name;`;

  const { rows } = await pool.query(sql);
  return rows;
}

export async function getCategory(id) {
  const sql = `
    select id, name
    from category
    where id = $1`;

  const { rows } = await pool.query(sql, [id]);
  return rows;
}

export async function getItemsForCategory(id) {
  const sql = `
    select id, name, price, in_stock
    from item
    join item_category on item.id = item_id
    where category_id = $1`;

  const { rows } = await pool.query(sql, [id]);
  return rows;
}

export async function getItemsRecentlyUpdated(limit) {
  const sql = `
    select id, name, price, in_stock, updated
    from item
    order by updated desc
    limit $1`;

  const { rows } = await pool.query(sql, [limit]);
  return rows;
}

export async function getItemsLowOnStock(stockThreshold) {
  const sql = `
    select id, name, in_stock
    from item
    where in_stock < $1
    order by in_stock`;

  const { rows } = await pool.query(sql, [stockThreshold]);
  return rows;
}

export async function getItemsWithMissingInfo() {
  const sql = `
    select id, name, price, in_stock
    from item
    where price is null or in_stock is null
    order by name`;

  const { rows } = await pool.query(sql);
  return rows;
}

export async function insertCategory(category) {
  const sql = `
    insert into category (name)
    values ($1)
    returning id, name
  `;

  const result = await pool.query(sql, [category.name]);
  return result;
}

export async function updateCategory(id, category) {
  const sql = `
    update category
    set name = $2
    where id = $1
  `;

  const result = await pool.query(sql, [id, category.name]);
  return result;
}

export async function deleteCategory(id) {
  const sql = `
    delete from category
    where id = $1`;

  const result = await pool.query(sql, [id]);
  return result;
}

export async function getItems() {
  const sql = `
    select id, name, price, in_stock
    from item
    order by name
  `;

  const { rows } = await pool.query(sql);
  return rows;
}

export async function getItem(id) {
  const sql = `
    select * 
    from item
    where id = $1
  `;

  const result = await pool.query(sql, [id]);
  return result.rowCount == 1 ? result.rows[0] : null;
}

export async function getItemCategories(itemId) {
  const sql = `
    select category.id, category.name
    from item_category
    join category on category.id = category_id
    where item_id = $1
  `;

  const { rows } = await pool.query(sql, [itemId]);
  return rows;
}

export async function getCategoriesForItemWithSelection(itemId) {
  const sql = `
    select category.id, category.name, count(item_id) filter(where item_id = $1) as selected
    from category
    left join item_category on category_id = category.id
    group by category.id
    order by category.name
  `;

  const { rows } = await pool.query(sql, [itemId]);

  for (const row of rows) {
    row.selected = row.selected === "1";
  }

  return rows;
}

export async function deleteItem(id) {
  const sql = `
    delete from item
    where id = $1`;

  const result = await pool.query(sql, [id]);
  return result;
}

export async function insertItem(item, categoryIds) {
  try {
    await pool.query("begin");

    const sql = `
      insert into item (name, description, price, in_stock, created, updated)
      values ($1, $2, $3, $4, current_timestamp, current_timestamp)
      returning id
    `;

    const result = await pool.query(sql, [
      item.name,
      item.description,
      item.price,
      item.in_stock,
    ]);

    const id = result.rows[0].id;

    await insertItemCategories(id, categoryIds);
    await pool.query("commit");

    return id;
  } catch (err) {
    await pool.query("rollback");
    throw err;
  }
}

async function insertItemCategories(itemId, categoryIds) {
  const sql = `
    insert into item_category (item_id, category_id)
    select $1, v.category_id from unnest($2::integer[]) as v(category_id);
  `;

  const result = await pool.query(sql, [itemId, categoryIds]);
  return result;
}

async function deleteItemCategories(itemId) {
  const sql = `
    delete from item_category
    where item_id = $1
  `;

  const result = await pool.query(sql, [itemId]);
  return result;
}

export async function updateItem(item, categoryIds) {
  try {
    await pool.query("begin");

    const sql = `
    update item 
    set
      name = $2,
      description = $3,
      price = $4,
      in_stock = $5,
      updated = current_timestamp
    where id = $1
  `;

    await pool.query(sql, [
      item.id,
      item.name,
      item.description,
      item.price,
      item.in_stock,
    ]);

    await deleteItemCategories(item.id);
    await insertItemCategories(item.id, categoryIds);
    await pool.query("commit");
  } catch (err) {
    await pool.query("rollback");
    throw err;
  }
}
