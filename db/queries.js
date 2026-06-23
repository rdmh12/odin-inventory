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
