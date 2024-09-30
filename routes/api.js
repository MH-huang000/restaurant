var express = require("express");
var router = express.Router();

var userModel = require("../models/user");
var itemModel = require("../models/item");
var orderModel = require("../models/order");

var auth = require("../middleware/auth");

var chartCount = 0;

router.use(auth);

router.get("/items", async function (req, res) {
  try {
    var store = req.session.store;
    var items = await itemModel.getAllItems(store);
    res.json(items);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

router.post("/create/item", async function (req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var store = req.session.store;

  try {
    var itemId = await itemModel.createItem(name, price, store);
    res.json(itemId);
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

router.delete("/delete/item/:id", async function (req, res) {
  var item = req.params.id;
  try {
    await itemModel.deleteItem(item);
    res.status(200).json();
  } catch (e) {
    res.status(500).end();
  }
});

router.get("/orders", async function (req, res) {
  var store = req.session.store;
  var orders = await orderModel.getAllOrder(store);
  res.json(orders);
});

router.post("/create/order", async function (req, res) {
  var store = req.session.store;
  var items = req.body.items;

  try {
    var orderId = await orderModel.createOrder(store, items);
    res.status(200).json(orderId);
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

router.post("/fin/order/:id", async function (req, res) {
  var order = req.params.id;

  try {
    await orderModel.finishOrder(order);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
});

router.post("/chat", async function (req, res) {
  var text = req.body.text;
  var store = req.session.store;
  switch (text) {
    case "help": {
      var help =
        `登出<br>` +
        `新增員工 - 將跳到員工註冊頁面<br>` +
        `所有員工 - 列出本店的所有員工<br>` +
        `銷量最好 - 列出銷量最好的品項<br>` +
        `銷額最好 - 列出銷量最額的品項<br>` +
        `總銷售額 - 列出本店的總銷售額<br>` +
        `統計圖表 - 繪製銷售統計圖`;
      return res.json({ msg: help });
    }

    case "新增員工": {
      return res.json({
        msg: "OK!",
        loc: "http://localhost:3000/app/regemployee.html",
      });
    }

    case "所有員工": {
      var employees = await userModel.getAllEmployee(store);
      var msg = "";
      for (let e of employees) {
        msg += `員工名稱: ${e.name} 員工帳號: ${e.account}<br>`;
      }
      return res.json({
        msg: msg,
      });
    }

    case "銷量最好": {
      var a = await orderModel.getItemWithMostAmount(store);
      var msg = `${a.name}: 共 ${a.amount} 份`;
      return res.json({ msg: msg });
    }

    case "銷額最好": {
      var p = await orderModel.getItemWithMostProfit(store);
      var msg = `${p.name}: $${p.profit}`;
      return res.json({ msg: msg });
    }

    case "總銷售額": {
      var totalProfit = await orderModel.getTotalProfit(store);
      var msg = `$${totalProfit}`;
      return res.json({ msg: msg });
    }

    case "統計圖表": {
      chartCount++;
      var msg = `<div style="background-color: white;">
          <canvas id="chart${chartCount}" ></canvas>
        </div>`;
      var chartData = await orderModel.getChartContain(store);
      return res.json({ msg: msg, chart: chartCount, contain: chartData });
    }
  }

  res.json({ msg: "這我不太懂，你可以輸入 help 來查看我會做什麼" });
});

module.exports = router;
