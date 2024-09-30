var db = require("./storages/database");

async function createStore(store) {
  var sql = ` INSERT INTO store VALUES (
    "${store.account}", "${store.password}", "${store.name}",
    "${store.q1}", "${store.a1}",
    "${store.q2}", "${store.a2}",
    "${store.q3}", "${store.a3}"
  )`;
  await db.asyncQuery(sql);
}

async function createEmployee(employee) {
  var sql = `INSERT INTO employee VALUES (
    "${employee.store}", "${employee.name}",
    "${employee.account}", "${employee.password}"
  )`;

  await db.asyncQuery(sql);
}
async function getAllEmployee(store){
  var sql = `
    SELECT name, account
    FROM employee
    WHERE store = "${store}";
  `;
  var employees = await db.asyncQuery(sql);
  return employees;
}

async function deleteEmployee(employee){
  var sql = `
    DELETE FROM employee
    WHERE account = "${employee}";
  `;
  await db.asyncQuery(sql);
}

async function employeeExist(employee) {
  var sql = `SELECT "${employee}" IN (
    SELECT account FROM employee) AS res;`;
  var res = await db.asyncQuery(sql);
  return res[0].res;
}

async function storeExist(store) {
  var sql = `SELECT "${store}" IN (
    SELECT account FROM store) AS res;`;
  var res = await db.asyncQuery(sql);
  return res[0].res;
}

async function getEmployeePassword(user) {
  var sql = `
    SELECT password FROM employee
    WHERE account = "${user}"`;
  var res = await db.asyncQuery(sql);
  if (res) {
    return res[0].password;
  } else {
    return undefined;
  }
}

async function getStorePassword(user) {
  var sql = `
    SELECT password FROM store
    WHERE account = "${user}"`;
  var res = await db.asyncQuery(sql);
  if (res) {
    return res[0].password;
  } else {
    return undefined;
  }
}

async function getStore(user) {
  var sql = `
    SELECT store FROM employee
    WHERE account = "${user}"`;
  var res = await db.asyncQuery(sql);
  if (res) {
    return res[0].store;
  } else {
    return undefined;
  }
}

async function getQA(store) {
  var n = Math.floor(Math.random() * 3) + 1;
  var sql = `SELECT q${n} AS q, a${n} AS a
    FROM store WHERE account = "${store}"`;
  var res = await db.asyncQuery(sql);
  return { question: res[0].q, answer: res[0].a };
}

module.exports = {
  createStore,
  createEmployee,
  getAllEmployee,
  deleteEmployee,
  employeeExist,
  storeExist,
  getEmployeePassword,
  getStorePassword,
  getStore,
  getQA,
};
