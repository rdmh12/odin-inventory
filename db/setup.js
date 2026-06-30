import { Client } from "pg";

import { tables } from "./sql.js";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE,
  });

  await client.connect();
  await client.query(tables);
  await client.end();
}

main();
