import { Client } from "pg";

import { tables, testData, drop } from "./sql.js";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  await client.connect();
  await client.query(drop);
  await client.query(tables);
  await client.query(testData);
  await client.end();
}

main();
