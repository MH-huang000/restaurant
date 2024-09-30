/**
 * @typedef {Object} Item
 * @property {Number} id
 * @property {String} name
 * @property {Number} price
 */

var db = require("./storages/database");

async function getAllItems(store) {
  var sql = `
    SELECT 
    id, name, price
    FROM item
    WHERE store = "${store}";`;
  var items = await db.asyncQuery(sql);
  return items;
}

async function createItem(name, price, store) {
  var sql = `
    INSERT INTO item (name, price, store)
    VALUES ("${name}", "${price}", "${store}");
    `;
  var res = await db.asyncQuery(sql);
  var itemId = {
    id: res.insertId,
  };
  return itemId;
}

async function deleteItem(item) {
  var sql = `
    DELETE FROM contains
    WHERE item = "${item}";
    `;
  await db.asyncQuery(sql);
  sql = `
    DELETE FROM item
    WHERE id = "${item}";
    `;
  await db.asyncQuery(sql);
}

module.exports = {
  getAllItems,
  createItem,
  deleteItem,
};
