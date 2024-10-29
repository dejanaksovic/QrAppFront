import { getUserIdFromUrl, URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const passwordInput = document.getElementById("password-input");
const showPassButton = document.querySelector(".password-container > img");
const rememberCheckbox = document.querySelector("input[type=checkbox]");
const loginButton = document.querySelector("button");

// assets
let workerPassword = localStorage.getItem("workerPassword") ?? sessionStorage.getItem("workerPassword");
let showPassword = false;
let id = getUserIdFromUrl(window.location.search);
// Page setup
const pages = ["main", "500"]
const pageShifter = new PageShifter(pages, "main");
// handler
const handler = new RequestHandler(pageShifter, null, "worker");
// handlers
const handleLogin = async () => {
  if(!workerPassword) {
    workerPassword = passwordInput.value;
  }

  const options = {
    url: `${URL}/sessions/worker`,
    method: "POST",
    body: {
      password: workerPassword,
    }
  }
  
  const res = await handler.doRequest(options);

  if(res?.ok) {
    sessionStorage.setItem("workerPassword", workerPassword);
    if(rememberCheckbox.checked) {
      localStorage.setItem("workerPassword", workerPassword);
    }
    Router.workerChoose(id);
  }
  else {
    workerPassword = null;
  }
}
const handleTogglePasswordVisibility = () => {
  showPassword = !showPassword;
  showPassButton.src = showPassword ? "../../svgs/eye-closed.svg" : "../../svgs/openeye.svg";
  passwordInput.type = showPassword ? "text" : "password";
}
// connect handlers
loginButton.addEventListener("click", handleLogin);
showPassButton.addEventListener("click", handleTogglePasswordVisibility);
passwordInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") {
    handleLogin();
  }
})

// Default behaviour
if(workerPassword) {
  handleLogin();
}
