var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/app", function (req, res) {
  var role = req.session.role;
  if (role) {
    if (role === "store") {
      res.redirect("http://localhost:3000/app/admin.html");
    } else {
      res.redirect("http://localhost:3000/app/frontField.html");
    }
  } else {
    res.redirect("http://localhost:3000/app/login.html");
  }
});

module.exports = router;
