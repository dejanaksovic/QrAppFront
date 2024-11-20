import { FlashMessage } from "../../assets/Flash.js";
import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const passwordInput = document.getElementById("password");
const togglePasswordInputType = document.getElementById("toggle-pass");
const rememberMeInput = document.getElementById("remember-me");

const loginButton = document.getElementById("login-btn");

// logic
let showPassword = false;

// pages setup
const pages = ["main-page", "500"];
const pageShifter = new PageShifter(pages, "main-page");
// Handler request
const requestHandler = new RequestHandler(pageShifter, Router.adminViewAllUsers, "admin");

// Handlers
const handleLogin = async () => {
  // Save it
  sessionStorage.setItem("adminPassword", passwordInput.value);
  if(rememberMeInput.value) {
    localStorage.setItem("adminPassword", passwordInput.value);
  }

  const options = {
    method: "POST",
    url: `${URL}/sessions/admin`,
    body: {
      password: passwordInput.value,
    }
  }

  const res = await requestHandler.doRequest(options, "Uspesno logivanje");
  console.log(res);
}
const handlePasswordToggle = () => {
  showPassword = !showPassword;
  passwordInput.type = showPassword ? "text" : "password";
  togglePasswordInputType.src = showPassword ? "../../svgs/eye-closed.svg" : "../../svgs/openeye.svg";
}

// Connect handlers
loginButton.addEventListener("click", handleLogin);
togglePasswordInputType.addEventListener("click", handlePasswordToggle);
passwordInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") {
    handleLogin();
  }
})

// Default behaviour
const adminPassword = localStorage.getItem("adminPassword");
if(adminPassword) {
  passwordInput.value = adminPassword;
  handleLogin();
}