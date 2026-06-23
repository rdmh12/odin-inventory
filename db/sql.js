export const tables = `
  create table if not exists item (
    id          integer primary key generated always as identity,
    name        varchar(255) not null,
    description text,
    price       numeric,
    in_stock    integer,
    created     timestamp not null,
    updated     timestamp not null
  );

  create table if not exists category (
    id          integer primary key generated always as identity,
    name        varchar(255) not null unique
  );

  create table if not exists item_category (
    item_id     integer not null references item (id)     on delete cascade,
    category_id integer not null references category (id) on delete cascade
  );
`;

export const testData = `
  insert into category (name) values
  ('Laptops'),
  ('Gaming'),
  ('Components'),
  ('Peripherals'),
  ('Networking'),
  ('Storage');

  insert into item (name, description, price, in_stock, created, updated) overriding system value values 
  ('Acer Aspire 5', '15.6-inch everyday laptop', 699.99, 18, current_timestamp, current_timestamp),
  ('Dell XPS 13', 'Premium ultrabook with Intel CPU', 1299.99, 7, current_timestamp, current_timestamp),
  ('ASUS ROG Strix G16', 'Gaming laptop with RTX graphics', 1799.99, 5, current_timestamp, current_timestamp),
  ('Logitech MX Master 3S', 'Wireless productivity mouse', 99.99, 34, current_timestamp, current_timestamp),
  ('Logitech G Pro X', 'Mechanical gaming keyboard', 149.99, 22, current_timestamp, current_timestamp),
  ('Samsung 990 Pro 2TB', 'High-speed NVMe SSD', 179.99, null, current_timestamp, current_timestamp),
  ('WD Blue 4TB HDD', 'Reliable desktop hard drive', 89.99, 19, current_timestamp, current_timestamp),
  ('TP-Link Archer AX55', 'Wi-Fi 6 router', 119.99, 11, current_timestamp, current_timestamp),
  ('Netgear GS308', '8-port Gigabit switch', null, 16, current_timestamp, current_timestamp),
  ('Intel Core i7-14700K', null, 439.99, 8, current_timestamp, current_timestamp),
  ('AMD Ryzen 7 7800X3D', 'Gaming-focused processor', 389.99, 6, current_timestamp, current_timestamp),
  ('ASUS TUF RTX 4070', 'Mid-range gaming graphics card', 649.99, 4, current_timestamp, current_timestamp),
  ('Corsair Vengeance 32GB', 'DDR5 memory kit', 129.99, 25, current_timestamp, current_timestamp),
  ('Samsung Odyssey G5', '27-inch gaming monitor', 279.99, 9, current_timestamp, current_timestamp),
  ('Dell UltraSharp U2723QE', '4K professional monitor', 599.99, 3, current_timestamp, current_timestamp),
  ('HyperX Cloud III', 'Gaming headset', 89.99, 20, current_timestamp, current_timestamp),
  ('Seagate Expansion 5TB', 'External USB hard drive', 129.99, 13, current_timestamp, current_timestamp),
  ('Crucial BX500 1TB', 'SATA SSD storage drive', null, 17, current_timestamp, current_timestamp),
  ('Razer Basilisk V3', 'Ergonomic gaming mouse', 69.99, 15, current_timestamp, current_timestamp),
  ('Ubiquiti UniFi 6 Lite', 'Business-grade wireless access point', null, null, current_timestamp, current_timestamp);

  insert into item_category (item_id, category_id) values
  (1,1),(2,1),(3,1),(3,2),
  (4,4),(5,4),(5,2),
  (6,6),(6,3),(7,6),
  (8,5),(9,5),
  (10,3),(11,3),(11,2),
  (12,3),(12,2),(13,3),
  (14,4),(14,2),(15,4),
  (16,4),(16,2),
  (17,6),(18,6),
  (19,4),(19,2),
  (20,5);
`;

export const drop = `
  drop table if exists item_category;
  drop table if exists item;
  drop table if exists category;
`;
