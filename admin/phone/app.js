import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// Elements
const message = document.getElementById("message");

const [confirmButton, cancelButton] =
  document.querySelectorAll(".action button");

const userSelect = document.querySelector(".to select");
const chipsContainer = document.querySelector(".chip-container");

const navButtonOpen = document.querySelector("#nav-button");
const navButtonClonse = document.querySelector("#close-element");
const navBar = document.querySelector("nav");

// Pages setup
const pages = ["main", "500"];
const shifter = new PageShifter(pages, "main");

// Request handler
const handler = new RequestHandler(shifter, null, "admin");
// Helpers
const adminPassword = sessionStorage.getItem("adminPassword");
let globalUsers = [];
let userIds = [];

const addUserChip = (user) => {
  const { Name, Id } = user || {};

  const chipElem = document.createElement("span");
  chipElem.classList.add("chip");

  const removeElem = document.createElement("span");
  removeElem.textContent = "x";
  removeElem.setAttribute("user-id", Id);
  removeElem.addEventListener("click", handleRemoveChip);

  const nameElem = document.createElement("span");
  nameElem.textContent = Name;

  chipElem.append(removeElem, nameElem);

  chipsContainer.appendChild(chipElem);
};

const populateSelectSingle = (user) => {
  const { Id, Name } = user || {};

  const optionElem = document.createElement("option");
  optionElem.value = Id;
  optionElem.textContent = Name;

  userSelect.appendChild(optionElem);
};

const resetAllInputs = () => {
  userIds = [];
  chipsContainer.textContent = "";
  message.value = "";
};

// Handlers
const handleGetUsers = async (e) => {
  const options = {
    method: "GET",
    url: `${URL}/users`,
    password: adminPassword,
  };

  globalUsers = await handler.doRequest(options);

  for (let user of globalUsers) {
    populateSelectSingle(user);
  }
};

const handleAddChip = (e) => {
  const id = e.currentTarget.value;

  const user = globalUsers.find((e) => e.Id === id);
  if (!user) {
    return;
  }

  if (userIds.includes(id)) {
    return;
  }

  userIds.push(user.Id);
  addUserChip(user);
};

const handleRemoveChip = (e) => {
  const actualTarget = e.currentTarget;

  const id = actualTarget.getAttribute("user-id");
  const userIndex = userIds.indexOf(globalUsers.find((e) => e.Id === id));

  userIds.splice(userIndex, 1);

  actualTarget.parentElement.remove();
};

const handleSendPhoneAll = async () => {
  const options = {
    method: "POST",
    url: `${URL}/communication/phone`,
    password: adminPassword,
    body: {
      content: message.value,
      userIds,
    },
  };

  const res = await handler.doRequest(options, "Uspešno poslata poruka");

  resetAllInputs();
};

const handleCancel = () => {
  Router.adminViewAllArticles();
};

const handleCloseNav = () => {
  navBar.style.setProperty("--translation", "100%");
};
const handleOpenNav = () => {
  navBar.style.setProperty("--translation", "0%");
};

// Connect handlers
confirmButton.addEventListener("click", handleSendPhoneAll);
cancelButton.addEventListener("click", handleCancel);

navButtonOpen.addEventListener("click", handleOpenNav);
navButtonClonse.addEventListener("click", handleCloseNav);

// Default
if (!adminPassword) {
  Router.adminLogin();
}

handleGetUsers();
userSelect.addEventListener("change", handleAddChip);
