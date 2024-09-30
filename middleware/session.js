var session = require("express-session");
var mysqlStore = require("express-mysql-session")(session);

var storeOptions = {
  host: "localhost",
  port: 3306,
  user: "acp-dev",
  password: "acp-judge",
  database: "ntcu_dbp",
  createDatabaseTable: true,
};
var sessionStore = new mysqlStore(storeOptions);

var sessionConfig = {
  name: "SESSION",
  secret: "QeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5",
  store: sessionStore,
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

module.exports = session(sessionConfig);
