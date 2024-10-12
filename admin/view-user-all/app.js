import { FlashMessage } from "../../assets/Flash.js";
import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";
// Elements
const usersContainer = document.getElementById("users-container");
const addButton = document.getElementById("add-button");

// pages-setup
const pages = ["main-page", "500", "404"];
const pageShifter = new PageShifter(pages, "main-page");

// handler
const fetchHandler = new RequestHandler(pageShifter, undefined, "admin");


// Flash message
const flashMessage = new FlashMessage();
// Assets
const addUser = (user) => {
  // user container
  const userContainer = document.createElement("div");
  userContainer.classList.add("user");
  // icon
  const icon = document.createElement("img");
  icon.src = "../../svgs/user-pfp.svg";
  userContainer.appendChild(icon);
  // Name and balance
  const nameAndCoinsContainer = document.createElement("div");
  nameAndCoinsContainer.classList.add("name-and-coins");
  const nameContainer = document.createElement("p");
  nameContainer.id = "name";
  nameContainer.textContent = user.Name;
  const coinsContainer = document.createElement("p");
  coinsContainer.id = "coins";
  coinsContainer.textContent = user.Coins;
  nameAndCoinsContainer.appendChild(nameContainer);
  nameAndCoinsContainer.appendChild(coinsContainer);
  userContainer.appendChild(nameAndCoinsContainer);
  // Buttons
  const delButton = document.createElement("button");
  delButton.classList.add("remove-button");
  delButton.textContent = "OBRISI";
  delButton.setAttribute("user-id", user._id);
  delButton.addEventListener("click", handleDelete);
  // Change
  const changeButton = document.createElement("button");
  changeButton.classList.add("manage-button");
  changeButton.textContent = "IZMENI";
  changeButton.setAttribute("user-id", user._id);
  changeButton.addEventListener("click", handleChangeRedirect);
  userContainer.appendChild(delButton);
  userContainer.appendChild(changeButton);
  // Add to main container
  usersContainer.appendChild(userContainer);
}
let adminPassword;

// Handlers
const handleGetUsers = async () => {
  const options = {
    url: `${URL}/users`,
    method: "GET",
    password: adminPassword,
  }

  const users = await fetchHandler.doRequest(options);
  
  for (let user of users) {
    addUser(user);
  }
}
const handleAddRedirect = () => {
  window.location.assign(Router.adminAddUser);
}
const handleChangeRedirect = (e) => {
  const id = e.target.getAttribute("user-id");
  return window.location.assign(`${Router.adminChangeUser}?id=${id}`);
}
const handleDelete = async (e) => {
  const userId = e.target.getAttribute("user-id");
  const userContainer = e.target.closest('.user');

  const options = {
    url: `${URL}/users/${userId}`,
    method: "DELETE",
    password: adminPassword,
  }

  const deletedUser = await fetchHandler.doRequest(options, "Uspesno obrisan korisnik");
  // Delete on screen
  if(deletedUser?._id) {
    userContainer.remove();
  }
}

// Connect handlers
addButton.addEventListener("click", handleAddRedirect);

// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}
// Set on load
window.onload = handleGetUsers();
