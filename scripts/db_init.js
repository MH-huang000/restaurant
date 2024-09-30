var mysql = require("mysql");
var options = require("./options.json");

var connection = mysql.createConnection(options);

connection.connect(function (err) {
  if (err) {
    console.error("error: can not connect to MySQL");
    throw err;
  }

  init();
});

async function query(sql) {
  connection.query(sql, function (err) {
    if (err) {
      throw err;
    }
  });
}

var sqls = [
  `CREATE TABLE IF NOT EXISTS ntcu_dbp.store (
    account   VARCHAR(64) PRIMARY KEY,
    password  VARCHAR(64),
    name      VARCHAR(64),
    q1        TEXT,
    a1        TEXT,
    q2        TEXT,
    a2        TEXT,
    q3        TEXT,
    a3        TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS ntcu_dbp.employee (
    store     VARCHAR(64),
    name      VARCHAR(64),
    account   VARCHAR(64) PRIMARY KEY,
    password  VARCHAR(64),
    FOREIGN KEY(store) REFERENCES store(account)
  );`,
  `CREATE TABLE IF NOT EXISTS ntcu_dbp.item (
    id     INT          PRIMARY KEY AUTO_INCREMENT,
    name   VARCHAR(64),
    price  INT,
    store  VARCHAR(64),
    FOREIGN KEY(store) REFERENCES store(account)
  );`,
  `CREATE TABLE IF NOT EXISTS ntcu_dbp.order_ (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    finished  BOOLEAN,
    time      DATE,
    store     VARCHAR(64),
    FOREIGN KEY(store) REFERENCES store(account)
  );`,
  `CREATE TABLE IF NOT EXISTS ntcu_dbp.contains (
    order_ INT,
    item  INT,
    amount INT,
    FOREIGN KEY(order_) REFERENCES order_(id),
    FOREIGN KEY(item) REFERENCES item(id)
  );`,
];

async function init() {
  console.log("Initializing database...");
  try {
    await query("CREATE DATABASE IF NOT EXISTS ntcu_dbp;");
    console.log("Database: ntcu_dbp - OK");
  } catch (err) {
    console.error("Error: can not create ntcu_dbp database");
    throw err;
  }

  for (var sql of sqls) {
    try {
      await query(sql);
    } catch (err) {
      console.error(`Error: can not create table)`);
      throw err;
    }
  }
  console.log(`Succeed!\n`);
  console.log(`Press Ctrl + C to end the connection...`);
}

init();
