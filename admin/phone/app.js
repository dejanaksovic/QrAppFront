import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// Elements
const message = document.getElementById("message");

const [confirmButton, cancelButton] = document.querySelectorAll(".action button");

const userSelect = document.querySelector(".to select");
const chipsContainer = document.querySelector(".chip-container");

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
  const { Name, _id } = user || {};

  const chipElem = document.createElement("span");
  chipElem.classList.add("chip");

  const removeElem = document.createElement("span");
  removeElem.textContent = "x";
  removeElem.setAttribute("user-id", _id)
  removeElem.addEventListener("click", handleRemoveChip);

  const nameElem = document.createElement("span");
  nameElem.textContent = Name;

  chipElem.append(removeElem, nameElem);

  chipsContainer.appendChild(chipElem);
}

const populateSelectSingle = (user) => {
  const { _id, Name } = user || {};

  const optionElem = document.createElement("option");
  optionElem.value = _id;
  optionElem.textContent = Name;

  userSelect.appendChild(optionElem);
}

// Handlers
const handleGetUsers = async (e) => {
  const options = {
    method: "GET",
    url: `${URL}/users`,
    password: adminPassword,
  }

  globalUsers = await handler.doRequest(options);

  for(let user of globalUsers) {
    populateSelectSingle(user);
  }
}

const handleAddChip = (e) => {
  const id = e.currentTarget.value;

  const user = globalUsers.find(e => e._id === id);
  if(!user) {
    return;
  }

  if(userIds.includes(id)) {
    return;
  }
  
  userIds.push(user._id);
  addUserChip(user);
}

const handleRemoveChip = (e) => {
  const actualTarget = e.currentTarget;

  const id = actualTarget.getAttribute("user-id");
  const userIndex = userIds.indexOf(globalUsers.find(e => e._id === id));

  userIds.splice(userIndex, 1);

  actualTarget.parentElement.remove();
}

const handleSendPhoneAll = async () => {
  console.log(userIds.length);

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
  return;
};

const handleCancel = () => {
  Router.adminViewAllArticles();
};

// Connect handlers
confirmButton.addEventListener("click", handleSendPhoneAll);
cancelButton.addEventListener("click", handleCancel);

// Default
if (!adminPassword) {
  Router.adminLogin();
}

handleGetUsers();
userSelect.addEventListener("change", handleAddChip);
