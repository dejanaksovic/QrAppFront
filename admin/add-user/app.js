import { FlashMessage } from "../../assets/Flash.js";
import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

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

// request setup
const requestHandler = new RequestHandler(pageShifter, Router.adminViewAllUsers, "admin");


// Handlers
const handleCancel = () => {
  return window.location.assign(Router.adminViewAllUsers);
}

const handleAddUser = async () => {
  const requestOptions = {
    url: `${URL}/users/`,
    method: "POST",
    password: adminPassword,
    body: {
      name: inputName.value,
      coins: balanceInput.value,
    }
  }
  const { user } = await requestHandler.doRequest(requestOptions, "Korisnik uspesno kreiran") ?? {user:undefined};
}

// Connect handlers
cancelButton.addEventListener("click", handleCancel);
confirmButton.addEventListener("click", handleAddUser);

// Default behaviour
const adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}