import { getBasePath, getUserIdFromUrl, URL } from "../../assets/helpers";
import { PageShifter } from "../../assets/Pageshifter";
import { Router } from "../../assets/PagePaths";
import { FlashMessage } from "../../assets/Flash";

// ELEMENTS
const nameInput = document.getElementById("name-input");
const balanceInput = document.getElementById("balance-input");

const nameElement = document.getElementById("name");
const coinsElement = document.getElementById("coins");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

// Pages setup
const pages = ["main-container", "404", "500"]
const pageShifter = new PageShifter(pages, "main-container");
// Flash
const flashMessage = new FlashMessage();
// utils
let id, adminPassword;
// HANDLERS 
const handleCancel = () => {
  window.location.assign(Router.adminViewAllUsers);
}
const handleChange = async () => {
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : `${adminPassword}`,
      },
      body: JSON.stringify({
        name: nameInput.value,
        balance: balanceInput.value
      })
    });
    data = await res.json();
  }
  catch(err) {
    console.log(err);
    return pageShifter.showPageOnly("500");
  }

  const { user, message } = data;

  if(res.ok) {
    flashMessage.leaveMessage("Korisnik uspešno izmenjen", "success");
    return window.location.assign(Router.adminViewAllUsers);
  }

  if(res.status === 401 || res.status === 403) {
    sessionStorage.removeItem("adminPassword");
    localStorage.removeItem("adminPassword");
    return window.location.assign(Router.adminLogin);
  }

  if(res.status === 404) {
    return pageShifter.showPageOnly("404");
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }

  if(message) {
    return flashMessage.showMessage(message, "error");
  }
}
const handleGetUser = async () => {
  let res, data;
  try {
    res = await fetch(`${URL}/users/${id}`);
    data = await res.json();
  }
  catch(err) {
    return pageShifter.showPageOnly("500");
  }

  const { user, message } = data; 

  if(res.ok) {
    nameElement.textContent = user.Name;
    coinsElement.textContent = user.Coins;
    return;
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }

  if(res.status === 401 || res.status === 403) {
    return window.location.assign(Router.adminLogin);
  }

  if(res.status === 404) {
    return pageShifter.showPageOnly("404");
  }

  if(message) {
    return flashMessage.showMessage(message, "error");
  }
  
}


// ASSIGN HANDLERS
cancelButton.addEventListener("click", handleCancel);
confirmButton.addEventListener("click", handleChange);

// DEFAULT BEHAVIOUR
id = getUserIdFromUrl(window.location.search);
if(!id) {
  pageShifter.showPageOnly("404");
  throw Error("User not found");
}

adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}

handleGetUser();