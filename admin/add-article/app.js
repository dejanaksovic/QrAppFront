import { URL } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";
import { RequestHandler } from "../../assets/RequestHandler";

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

// fetchHandler
const fetchHandler = new RequestHandler(pageShifter, Router.adminViewAllArticles, "admin");

// HANDLERS
const handleConfirm = async (e) => {
  const options = {
    method: "POST",
    url: `${URL}/articles`,
    password: adminPassword,
    body: {
      name: nameInput.value,
      price: priceInput.value,
    }
  }

  await fetchHandler.doRequest(options, "Uspesno kreiran artikal");
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