var userModel = require("../models/user");

async function login(user, password) {
  if (user === undefined || password == undefined) {
    return undefined;
  }

  if (await userModel.employeeExist(user)) {
    var correct = await userModel.getEmployeePassword(user);
    if (password === correct) {
      var store = await userModel.getStore(user);
      return { store: store, role: "employee" };
    }
  } else if (await userModel.storeExist(user)) {
    var correct = await userModel.getStorePassword(user);
    if (password === correct) {
      var store = user;
      return { store: store, role: "store" };
    }
  }
  return undefined;
}

module.exports = { login };
