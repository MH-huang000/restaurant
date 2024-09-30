/**
 * @typedef {Object} ItemAndAmount
 * @property {String} name
 * @property {Number} price
 * @property {Number} amount
 */

/**
 * @typedef {Object} Order
 * @property {Number} id
 * @property {Number} total
 * @property {ItemAndAmount[]} items
 */

var db = require("./storages/database");

async function getAllOrder(store) {
  var sql = `
    SELECT id 
    FROM order_
    WHERE store = "${store}" and finished = FALSE;
  `;
  var orders = await db.asyncQuery(sql);
  var returnOrders = [];
  for (var i = 0; i < orders.length; i++) {
    sql = `
      SELECT SUM(price * amount) AS total
      FROM (
        SELECT 
        item.price AS price, contains.amount AS amount
        FROM contains
        LEFT JOIN item
        ON contains.item = item.id
        WHERE contains.order_ =  "${orders[i].id}") AS order_;
    `;
    var total = await db.asyncQuery(sql);
    sql = `
      SELECT 
      item.name AS name, item.price AS price, contains.amount AS amount
      FROM contains
      LEFT JOIN item
      ON contains.item = item.id
      WHERE contains.order_ =  "${orders[i].id}";
    `;
    var items = await db.asyncQuery(sql);
    var order = {
      id: orders[i].id,
      total: total[0].total,
      items: items,
    };
    returnOrders.push(order);
  }
  return returnOrders;
}

async function createOrder(store, items) {
  var sql = `
    INSERT INTO order_ (finished, time, store)
    VALUES (FALSE, CURRENT_DATE, "${store}");
  `;
  var res = await db.asyncQuery(sql);
  var orderId = {
    id: res.insertId,
  };
  for (var i = 0; i < items.length; i++) {
    sql = `
      SELECT id 
      FROM item 
      WHERE name = "${items[i].name}"; 
    `;
    var itemId = await db.asyncQuery(sql);
    itemId = itemId[0].id;
    sql = `
      INSERT INTO contains (order_, item, amount)
      VALUES ("${orderId.id}", "${itemId}", "${items[i].amount}");
    `;
    await db.asyncQuery(sql);
  }
  return orderId;
}

async function finishOrder(orderId) {
  var sql = ` 
    UPDATE order_
    SET finished = TRUE
    WHERE id = "${orderId}" AND finished = FALSE;`;
  await db.asyncQuery(sql);
}

async function getTotalProfit(store) {
  var sql = `
    SELECT SUM(item.price * contains.amount) AS total
    FROM contains
    LEFT JOIN item
    ON contains.item = item.id
    WHERE contains.order_ IN (
      SELECT id 
      FROM order_
      WHERE store = "${store}"
    );
    `;
  var totalProfit = await db.asyncQuery(sql);
  return totalProfit[0].total;
}

async function getItemWithMostProfit(store) {
  var sql = `
    SELECT name, SUM(amount * price) AS profit
    FROM contains
    LEFT JOIN item
    ON contains.item = item.id
    WHERE item.id IN (
      SELECT id 
      FROM item
      WHERE store = "${store}"
    )
    GROUP BY name
    ORDER BY profit DESC
    LIMIT 1;
  `;
  var itemWithMostProfit = await db.asyncQuery(sql);
  var res = {
    name: itemWithMostProfit[0].name,
    profit: itemWithMostProfit[0].profit,
  };
  return res;
}

async function getChartContain(store) {
  var sql = `
    SELECT name, SUM(amount * price) AS profit
    FROM contains
    LEFT JOIN item
    ON contains.item = item.id
    WHERE item.id IN (
      SELECT id 
      FROM item
      WHERE store = "${store}"
    )
    GROUP BY name`;
  var items = await db.asyncQuery(sql);
  var labels = [];
  var data = [];

  for (let item of items) {
    labels.push(item.name);
    data.push(item.profit);
  }

  return { labels: labels, data: data };
}

async function getItemWithMostAmount(store) {
  var sql = `
    SELECT name, SUM(amount) as amount
    FROM (
      SELECT name, amount
      FROM contains
      LEFT JOIN item
      ON contains.item = item.id
        WHERE item.id IN (
          SELECT id 
          FROM item
          WHERE store = "${store}"
        )
    ) AS items
    GROUP BY items.name
    ORDER BY amount DESC
    LIMIT 1;
  `;
  var itemWithMostAmount = await db.asyncQuery(sql);
  var res = {
    name: itemWithMostAmount[0].name,
    amount: itemWithMostAmount[0].amount,
  };
  return res;
}

module.exports = {
  getAllOrder,
  createOrder,
  finishOrder,
  getTotalProfit,
  getItemWithMostProfit,
  getItemWithMostAmount,
  getChartContain
};
