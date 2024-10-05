import { FlashMessage } from "../../assets/Flash";
import { URL } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";

// ELEMENTS
const nameInput = document.getElementById("name-input");
const priceInput = document.getElementById("price-input");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

// utils
let adminPassword;

// page setup
const pages = ["main-container", "500"];
const pageShifter = new PageShifter(pages, "main-container");

// flash message
const flashMessage = new FlashMessage();

// HANDLERS
const handleConfirm = async (e) => {
  let res, data;
  try {
    res = await fetch(`${URL}/articles/`,{
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : adminPassword,
      },
      body: JSON.stringify({
        name: nameInput.value,
        price: priceInput.value,
      })
    })
    data = await res.json();
  }
  catch(err) {
    return pageShifter.showPageOnly("500");
  }

  const { user, message } = data;

  // Handle ok
  if(res.ok) {
    flashMessage.leaveMessage("Artikal uspešno kreiran", "success");
    return window.location.assign(Router.adminViewAllArticles);    
  }

  if(res.status === 401 || res.status === 403) {
    flashMessage.leaveMessage("Neautorizovana akcija", "error");
    return window.location.assign(Router.adminLogin);
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }

  if(message) {
    return flashMessage.showMessage(message, "error");
  }
}
const handleCancel = () => {
  return window.location.assign(Router.adminViewAllArticles);
}

// connect handlers
confirmButton.addEventListener("click", handleConfirm);
cancelButton.addEventListener("click", handleCancel);

// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword)
  window.location.assign(Router.adminLogin);