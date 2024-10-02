import { FlashMessage } from "../../assets/Flash";
import { URL } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";

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

// flash messages
const flashMessage = new FlashMessage();

// Handlers
const handleLogin = async () => {
  let res, data;
  try {
    console.log(passwordInput.value)
    
    res = await fetch(`${URL}/sessions/admin`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      },
      body: JSON.stringify({
        password: passwordInput.value,
      })
    })
  }
  catch(err) {
    sessionStorage.removeItem("adminPassword");
    localStorage.removeItem("adminPassword");
    return pageShifter.showPageOnly("500");
  }
  if(res.ok) {
    if(rememberMeInput.checked) {
      localStorage.setItem("adminPassword", passwordInput.value);
    }
    sessionStorage.setItem("adminPassword", passwordInput.value);
    return window.location.assign(Router.adminViewAllUsers);
  }
  sessionStorage.removeItem("adminPassword");
  localStorage.removeItem("adminPassword");
  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }
  passwordInput.value = "";
  return flashMessage.showMessage("Pogresna sifra", "error");
}
const handlePasswordToggle = () => {
  showPassword = !showPassword;
  passwordInput.type = showPassword ? "text" : "password";
  togglePasswordInputType.src = showPassword ? "../../svgs/eye-closed.svg" : "../../svgs/openeye.svg";
}

// Connect handlers
loginButton.addEventListener("click", handleLogin);
togglePasswordInputType.addEventListener("click", handlePasswordToggle);

// Default behaviour
const adminPassword = localStorage.getItem("adminPassword");
if(adminPassword) {
  passwordInput.value = adminPassword;
  handleLogin();
}