import { FlashMessage } from "../../assets/Flash";
import { getUserIdFromUrl, URL } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";

// ELEMENTS
const passwordInput = document.getElementById("password-input");
const showPassButton = document.querySelector(".password-container > img");
const rememberCheckbox = document.querySelector("input[type=checkbox]");
const loginButton = document.querySelector("button");

// assets
let workerPassword;
let showPassword = false;
let id = getUserIdFromUrl(window.location.search);
// flash setup
const flashMessage = new FlashMessage();
// Page setup
const pages = ["main", "500"]
const pageShifter = new PageShifter(pages, "main");

// handlers
const handleLogin = async () => {
  let res, data;
  try {
    res = await fetch(`${URL}/sessions/worker`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({
        password: workerPassword ? workerPassword : passwordInput.value
      })
    });
  }
  catch(err) {
    return pageShifter.showPageOnly("500");
  }
  if(res.ok) {
    if(rememberCheckbox.checked) {
      localStorage.setItem("workerPassword", workerPassword ? workerPassword : passwordInput.value);
    }
    sessionStorage.setItem("workerPassword", workerPassword ? workerPassword : passwordInput.value);
    return window.location.assign(`${Router.workerMainView}?id=${id}`);
  }
  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }
  return flashMessage.showMessage("Nevalidni kredencijali", "error");
}
const handleTogglePasswordVisibility = () => {
  showPassword = !showPassword;
  showPassButton.src = showPassword ? "../../svgs/openeye.svg" : "../../svgs/eye-closed.svg";
  passwordInput.type = showPassword ? "text" : "password";
}
// connect handlers
loginButton.addEventListener("click", handleLogin);
showPassButton.addEventListener("click", handleTogglePasswordVisibility);

// Default behaviour
workerPassword = localStorage.getItem("workerPassword") ? localStorage.getItem("workerPassword") : sessionStorage.getItem("workerPassword");
if(workerPassword) {
  handleLogin();
}
