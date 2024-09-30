var logoutBtn = document.getElementById("sign_out");

logoutBtn.onclick = function () {
  fetch("http://localhost:3000/auth/logout", {
    method: "POST",
  }).then((res) => {
    alert("登出成功!");
    location = "http://localhost:3000/app";
  });
};
