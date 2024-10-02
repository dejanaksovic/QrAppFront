import { FlashMessage } from "../../assets/Flash";
import { URL } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";

// ELEMENTS
const inputName = document.getElementById("name-input");
const balanceInput = document.getElementById("balance-input");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");


// page setup
const pages = ["main-container", "500"];
const pageShifter = new PageShifter(pages, "main-container");
// flash setup
const flashMessage = new FlashMessage();

// Handlers
const handleCancel = () => {
  return window.location.assign(Router.adminViewAll);
}

const handleAddUser = async () => {
  let res, data;
  try {
    res = await fetch(`${URL}/users/`,{
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : adminPassword,
      },
      body: JSON.stringify({
        name: inputName.value,
        coins: balanceInput.value,
      })
    })
    data = await res.json();
  }
  catch(err) {
    pageShifter.showPageOnly("500");
  }

  const { user, message } = data;

  if(res.ok) {
    return window.location.assign(Router.adminViewAll);
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }

  return flashMessage.showMessage(message, "error");
}

// Connect handlers
cancelButton.addEventListener("click", handleCancel);
confirmButton.addEventListener("click", handleAddUser);

// Default behaviour
const adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}