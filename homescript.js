window.onload = function () {
    var username = sessionStorage.getItem("login");
    if (username) {
      document.getElementById("login").textContent = username;
    }
  };