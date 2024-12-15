import { getUserIdFromUrl, URL } from "../../assets/helpers.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { Router } from "../../assets/PagePaths.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const nameInput = document.getElementById("name-input");
const balanceInput = document.getElementById("balance-input");
const emailInput = document.getElementById("email-input");
const phoneInput = document.getElementById("phone-input");

const nameElement = document.getElementById("name");
const coinsElement = document.getElementById("coins");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

// Pages setup
const pages = ["main-container", "404", "500"];
const pageShifter = new PageShifter(pages, "main-container");
// request handler
const requestHandler = new RequestHandler(
  pageShifter,
  Router.adminViewAllUsers,
  "admin"
);
// utils
let id, adminPassword;
// HANDLERS
const handleCancel = () => {
  return Router.adminViewAllUsers();
};
const handleChange = async () => {
  const requestOptions = {
    url: `${URL}/users/${id}`,
    method: "PATCH",
    password: adminPassword,
    body: {
      name: nameInput.value,
      coins: balanceInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
    },
  };

  await requestHandler.doRequest(requestOptions, "Korisnik uspešno izmenjen");
};
const handleGetUser = async () => {
  const requestOptions = {
    url: `${URL}/users/${id}`,
    method: "GET",
  };

  const user = (await requestHandler.doRequest(requestOptions)) ?? {
    user: undefined,
  };

  if (user) {
    nameElement.textContent = user.Name;
    coinsElement.textContent = user.Coins;
  }
};

// ASSIGN HANDLERS
cancelButton.addEventListener("click", handleCancel);
confirmButton.addEventListener("click", handleChange);

// DEFAULT BEHAVIOUR
id = getUserIdFromUrl(window.location.search);
if (!id) {
  pageShifter.showPageOnly("404");
  throw Error("User not found");
}

adminPassword = sessionStorage.getItem("adminPassword");
if (!adminPassword) {
  window.location.assign(Router.adminLogin);
}

handleGetUser();
