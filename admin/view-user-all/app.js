import { getTransactionTime, URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";
// Elements
const usersContainer = document.getElementById("users-container");
const addButton = document.getElementById("add-button");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

const selectedContainer = document.querySelector(".user-card");
const selectedUserName = document.getElementById("user-card-name");
const selectedUserCoins = document.getElementById("user-card-coins");
const changeSelectButton = document.querySelector(".user-card-manage-button");
const delSelectButton = document.querySelector(".user-card-remove-button");
const seeMore = document.getElementById("see-more");
const seeLess = document.getElementById("see-less");

const transactionsContainer = document.getElementById("transactions-container");

const paginationButtons = document.querySelectorAll(".page-number-button");

// pages-setup
const pages = ["main-page", "500", "404"];
const pageShifter = new PageShifter(pages, "main-page");

// handler
const fetchHandler = new RequestHandler(pageShifter, undefined, "admin");

// Assets
let usersGlobal = [];
let adminPassword;
let pageStart = 0;

const addUser = (user) => {
  // user container
  const userContainer = document.createElement("div");
  userContainer.setAttribute("user-id", user._id);
  userContainer.classList.add("user");
  userContainer.addEventListener("click", handleSelect, {capture: true});
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
const clearUserContainer = () => {
  usersContainer.textContent = "";
}

const updateSelectedStatus = (user) => {
  const { Name, Coins, _id } = user;

  selectedUserCoins.textContent = Coins;
  selectedUserName.textContent = Name;

  seeMore.setAttribute("user-id", _id);
  changeSelectButton.setAttribute("user-id", _id);
  delSelectButton.setAttribute("user-id", _id);
}

const addTransaction = (transaction) => {
  const { createdAt, Coins } = transaction;

  const orderElement = document.createElement("p");
  const coinsElement = document.createElement("p");
  const dateElement = document.createElement("p");
  // populate
  for(let { Article, Quantity } of transaction.Order) {
    orderElement.textContent+= `${Article.Name} ${Quantity}, `;
  }

  coinsElement.textContent = Coins;
  dateElement.textContent = getTransactionTime(new Date(createdAt));

  transactionsContainer.append(orderElement, coinsElement, dateElement);
}


// Handlers
const handleGetUsers = async () => {
  const options = {
    url: `${URL}/users`,
    method: "GET",
    password: adminPassword,
    queryParams: {
      ps: pageStart,
      pc: 20,
    }
  }

  const users = await fetchHandler.doRequest(options);
  usersGlobal = users;
  // RESET
  usersContainer.textContent = "";
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
  const userContainer = document.querySelector(`.user[user-id="${userId}"]`)

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
const handleSearchByName = async(e) => {
  const options = {
    url: `${URL}/users`,
    method: "GET",
    password: adminPassword,
    queryParams: {
      nameFilter: searchInput.value,
      ps: pageStart,
      pc: 20,
    }
  }

  const users = await fetchHandler.doRequest(options);

  clearUserContainer();

  for(let user of users) {
    addUser(user);
  }
}
const handleSelect = (e) => {
  const id = e.currentTarget.getAttribute("user-id");
  e.currentTarget.classList.toggle("selected");

  const selectedUserNew = usersGlobal?.find(e => e._id === id);
  // Reset transactions
  handleSeeLess();
  updateSelectedStatus(selectedUserNew);
  // Show
  selectedContainer.classList.remove("hidden");
}
const handleGetUserTransactions = async (e) => {
  const options = {
    url: `${URL}/transactions/${e.currentTarget.getAttribute("user-id")}`,
    method: "GET",
    password: adminPassword,
  }

  const transactions = await fetchHandler.doRequest(options);

  // Refresh
  transactionsContainer.textContent = "";
  for(let transaction of transactions) {
    addTransaction(transaction);
  }

  transactionsContainer.classList.remove("hidden");
  seeLess.classList.remove("hidden");
  seeMore.classList.add("hidden");
}
const handleSeeLess = () => {
  transactionsContainer.classList.add("hidden");
  seeMore.classList.remove("hidden");
  seeLess.classList.add("hidden");
}
const handlePaginate = (e) => {
  pageStart = Number(e.currentTarget.textContent) - 1;

  handleGetUsers();
}

// Connect handlers
addButton.addEventListener("click", handleAddRedirect);
searchButton.addEventListener("click", handleSearchByName);
seeMore.addEventListener("click", handleGetUserTransactions);
seeLess.addEventListener("click", handleSeeLess);
changeSelectButton.addEventListener("click", handleChangeRedirect);
delSelectButton.addEventListener("click", e => {
  handleDelete(e);
  selectedContainer.classList.add("hidden");
});
for(let button of paginationButtons) {
  button.addEventListener("click", handlePaginate);
}
// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}
// Set on load
window.onload = handleGetUsers();
