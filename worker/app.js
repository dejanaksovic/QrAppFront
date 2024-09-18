// Imports
import { getUserIdFromUrl } from "../assets/helpers";
import { FlashMessage } from "../assets/Flash";

// ELEMENTS
// Pages
const [all, workerPage] = document.querySelectorAll(".main-div");
const loginPage = document.querySelector(".enterPass-div"); 
const notFoundPage = document.querySelector(".container-404");
// Inputs
const passwordInput = document.querySelector("#password");
const balanceInput = document.querySelector("#balance");
// Buttons
const confirmPassword = document.querySelector("#confirm-button");
const addBalanceButton = document.querySelector(".addButton");
const removeBalanceButton = document.querySelector(".removeButton");
// Flash
const flashContainer = document.querySelector(".flash-container");

// ESSENTIALS
const URL = "https://qrappback.onrender.com";
let password;
let balance = localStorage.getItem("password");
let message;


// UTILS
// Pages
const showWorkerPage = () => {
  hide404();
  hidePasswordPage();
  workerPage.classList.remove("hidden");
}
const hideWorkerPage = () => {
  workerPage.classList.add("hidden");
}
// Password
const hidePasswordPage = () => {
  loginPage.classList.add("hidden");
}
const showPasswordPage = () => {
  hide404();
  hideWorkerPage();
  confirmPassword.classList.remove("hidden")
}
// 404
const hide404 = () => {
  notFoundPage.classList.add("hidden");
}
const show404 = () => {
  // set message
  notFoundPage.children[1].textContent = message;
  hidePasswordPage();
  hideWorkerPage();
  notFoundPage.classList.remove("hidden");
}

// Flash
const flashMessage = new FlashMessage("flash");

// GET ID FROM URL
const id = getUserIdFromUrl(window.location.search);
// If id not found show-error
if(!id) {
  console.log("No id");
  message = "Korisnik nije pronadjen, ako ste skenirali qr code i dobili ovu stranu pokusajte ponovo ili kontaktirajte administratora";
  show404();
}

// HANDLING BALANCE
// Validate balance
const validateBalance = (balance) => {
  isNaN(Number(balance)) || balance < 0 ? false : true
}

// Handle add
const addBalanceHandler = (e) => {
  // Check for invalid input
  if(validateBalance(balanceInput.value)) {
    return console.log("Invalid balance value");
  }
  balance = Number(balanceInput.value);
  balanceInput.value = "";
  if(!password) {
    // Hide everything except password page
    workerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
  }
}

// Handle remove
const removeBalanceHandler = (e) => {
  if(validateBalance(balanceInput.value)) {
    return console.log("Invalid balance value");
  }
  balance = Number(balanceInput.value) * (-1);
  balanceInput.value = "";
  if(!password) {
    // Hide everything except password page
    workerPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
  }
  else {
    doRequest(URL);
  }
}

// PASSWORD HANDLING
const handlePasswordInput = (e) => {
  password = passwordInput.value;
  handleRequest(URL);
  passwordInput.value = ""
  // Hide pass page
}

// Connect handlers
addBalanceButton.addEventListener("click", addBalanceHandler);
removeBalanceButton.addEventListener("click", removeBalanceHandler);
confirmPassword.addEventListener("click", handlePasswordInput);

// Balance request handler
const handleRequest = async (url) => {
  let message;
  try {
    const res = await fetch(`${url}/users/${id}`, {
      method: "POST",
      body: JSON.stringify({ balance }),
      headers: {
        "authorization": password,
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    // Handle not found user
    if(res.status == 404) {
      return show404();
    }
    // Handle wrong password
    if(res.status == 401 || res.status == 403) {
      password = "";
      localStorage.removeItem("password");
    }
    // Handle response
    if(!res.ok) {
      message = data?.message;
      console.log(message);
      return flashMessage.showMessage(message, "success");
    }
  }
  catch(err) {
    message = "Problem sa konekcijom, proverite internet i pokusajte opet"
  }
}