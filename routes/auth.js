var express = require("express");
var router = express.Router();

var userModel = require("../models/user");
var auth = require("../controllers/auth");

router.post("/login", async function (req, res) {
  var user = req.body.account;
  var password = req.body.password;

  var userInfo = await auth.login(user, password);
  if (userInfo) {
    req.session.store = userInfo.store;
    req.session.user = user;
    req.session.role = userInfo.role;
    return res.status(200).json({ msg: "OK", role: userInfo.role });
  }
  res.status(401).json({ msg: "failed" });
});

router.get("/qa", async function (req, res) {
  var store = req.session.store;
  if (store) {
    var QA = await userModel.getQA(store);
    console.log(QA);
    return res.json(QA);
  }
  res.status(401).end();
});

router.post("/logout", async function (req, res) {
  if (req.session.store) {
    res.clearCookie("SESSION").end();
    req.session.destroy();
  } else {
    res.status(401).end();
  }
});

router.post("/signup/store", async function (req, res) {
  var user = req.body.account;
  if (await userModel.storeExist(user)) {
    return res.status(400).json({ msg: `${user} is already exist` });
  }

  if (checkStore(req.body)) {
    try {
      await userModel.createStore(req.body);
      return res.json({ msg: "OK" });
    } catch (e) {
      return res.status(500).edn({ msg: "Internal Error" });
    }
  }
  res.status(400).json({ msg: "invalid parameters" });
});

router.post("/signup/employee", async function (req, res) {
  var user = req.body.account;
  if (await userModel.employeeExist(user)) {
    return res.status(400).json({ msg: `${user} is already exist` });
  }

  var store = req.session.store;
  if (store === undefined) {
    res.status(401).json({ msg: "Not logged in" });
  }

  var e = {
    store: store,
    name: req.body.name,
    account: req.body.account,
    password: req.body.password,
  };

  if (checkEmployee(e)) {
    await userModel.createEmployee(e);
    return res.json({ msg: "OK" });
  }
  res.status(400).json({ msg: "invalid parameters" });
});

module.exports = router;

function checkEmployee(body) {
  const fields = ["name", "account", "password"];
  for (let field of fields) {
    if (!body[field]) {
      return false;
    }
  }
  return true;
}

function checkStore(body) {
  if (body === undefined) {
    return false;
  }

  const fields = [
    "account",
    "password",
    "name",
    "q1",
    "a1",
    "q2",
    "a2",
    "q3",
    "a3",
  ];
  for (let field of fields) {
    if (!body[field]) {
      return false;
    }
  }
  return true;
}
