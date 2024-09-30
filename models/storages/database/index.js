var mysql = require("mysql");
var config = require("./config.json");

var pool = mysql.createPool(config.dev);

/**
 * Query to MySQL and pass the query result to the callback
 *
 * @param  {String} sql - SQL command
 * @param  {Function} callback
 * @return {void}
 */
function query(sql, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error("error: can not connect to MySQL");
      throw err;
    }

    connection.query(sql, function (err, res) {
      if (err) {
        console.error("error: can not query to MySQL");
        throw err;
      }

      if (callback) {
        callback(res);
      }
    });
  });
}

/**
 * Query to MySQL asynchronously
 *
 * @param  {String} sql - SQL command
 * @return {Promise} Promise object represents the result of query
 */
async function asyncQuery(sql) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("error: can not connect to MySQL via pool");
        reject(err);
      }

      connection.query(sql, function (err, res) {
        if (err) {
          console.error("error: can not query to MySQL");
          reject(err);
        }

        resolve(res);
      });
    });
  });
}

module.exports = { query, asyncQuery };
