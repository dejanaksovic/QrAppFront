import { getTransactionTime, URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { Popup } from "../../assets/Popup.js";
import { RequestHandler } from "../../assets/RequestHandler.js";
// Elements
const usersContainer = document.getElementById("users-container");
const addButton = document.getElementById("add-button");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");

const selectedContainer = document.querySelector(".view-user-card");
const selectedUserName = document.getElementById("user-card-name");
const selectedUserCoins = document.getElementById("user-card-coins");
const changeSelectButton = document.querySelector(".user-card-manage-button");
const delSelectButton = document.querySelector(".user-card-remove-button");

const seeMore = document.getElementById("see-more");
const seeLess = document.getElementById("see-less");

const transactionsContainer = document.getElementById("transactions-container");

const [pageLeft, pageRight] = document.querySelectorAll(".pagination button");

// pages-setup
const pages = ["main-page", "500", "404"];
const pageShifter = new PageShifter(pages, "main-page");

// handler
const fetchHandler = new RequestHandler(pageShifter, undefined, "admin");

const popup = new Popup();

// Assets
let usersGlobal = [];
let adminPassword;

let pageStart = 0;
let pageCount = 20;
let pageMaxReached = false;

const addUser = (user) => {
  // user container
  const userContainer = document.createElement("div");
  userContainer.setAttribute("user-id", user.Id);
  userContainer.classList.add("user");
  userContainer.addEventListener("click", handleSelect, { capture: true });
  // icon
  const icon = document.createElement("img");
  icon.src = "../../svgs/user-pfp.svg";
  userContainer.appendChild(icon);
  // Name and balance
  const nameAndCoinsContainer = document.createElement("div");
  nameAndCoinsContainer.classList.add("user-name-and-coins");
  const nameContainer = document.createElement("p");
  nameContainer.textContent = user.Name;
  const coinsContainer = document.createElement("p");
  coinsContainer.textContent = user.Coins;
  nameAndCoinsContainer.appendChild(nameContainer);
  nameAndCoinsContainer.appendChild(coinsContainer);
  userContainer.appendChild(nameAndCoinsContainer);
  // Button container
  const actionButtons = document.createElement("div");
  actionButtons.classList.add("user-delete-edit-buttons");
  // Buttons
  const delButton = document.createElement("button");
  delButton.classList.add("remove-button");
  delButton.textContent = "OBRISI";
  delButton.setAttribute("user-id", user.Id);
  delButton.addEventListener("click", handleDelete);
  // Change
  const changeButton = document.createElement("button");
  changeButton.classList.add("manage-button");
  changeButton.textContent = "IZMENI";
  changeButton.setAttribute("user-id", user.Id);
  changeButton.addEventListener("click", handleChangeRedirect);
  // Connect buttons
  actionButtons.append(delButton, changeButton);
  userContainer.append(actionButtons);
  // Add to main container
  usersContainer.appendChild(userContainer);
};
const clearUserContainer = () => {
  usersContainer.textContent = "";
};

const updateSelectedStatus = (user) => {
  const { Name, Coins, Id } = user;

  selectedUserCoins.textContent = Coins;
  selectedUserName.textContent = Name;

  seeMore.setAttribute("user-id", Id);
  changeSelectButton.setAttribute("user-id", Id);
  delSelectButton.setAttribute("user-id", Id);
};

const addTransaction = (transaction) => {
  const { createdAt, Coins } = transaction;
  // Conainer
  const container = document.createElement("div");
  container.classList.add("transaction");

  const orderElement = document.createElement("p");
  const coinsElement = document.createElement("p");
  const dateElement = document.createElement("p");
  // populatej
  for (let { Article, Quantity } of transaction.Order) {
    orderElement.textContent += `${Article.Name} ${Quantity}, `;
  }

  coinsElement.textContent = Coins;
  dateElement.textContent = getTransactionTime(new Date(createdAt));

  container.append(orderElement, coinsElement, dateElement);
  transactionsContainer.append(container);
};

// Handlers
const handleGetUsers = async () => {
  const options = {
    url: `${URL}/users`,
    method: "GET",
    password: adminPassword,
    queryParams: {
      ps: pageStart,
      pc: pageCount,
    },
  };

  const users = await fetchHandler.doRequest(options);
  usersGlobal = users;
  console.log(usersGlobal);
  if (users.length < pageCount) {
    pageMaxReached = true;
  } else {
    pageMaxReached = false;
  }
  // RESET
  usersContainer.textContent = "";
  for (let user of users) {
    addUser(user);
  }
};
const handleAddRedirect = () => {
  return Router.adminAddUser();
};
const handleChangeRedirect = (e) => {
  const id = e.target.getAttribute("user-id");
  return Router.adminChangeUser(id);
};
const handleDeleteSelect = async (e) => {
  popup.showPopup(
    "Da li ste sigurni da zelite da obrisete korisnika",
    handleDelete,
    e
  );
};
const handleDelete = async (e) => {
  console.log("Im running");
  e.stopPropagation();
  const userId = e.target.getAttribute("user-id");
  const userContainer = document.querySelector(`.user[user-id="${userId}"]`);
  const options = {
    url: `${URL}/users/${userId}`,
    method: "DELETE",
    password: adminPassword,
  };

  const deletedUser = await fetchHandler.doRequest(
    options,
    "Uspesno obrisan korisnik"
  );
  // Delete on screen
  userContainer.remove();
  selectedContainer.classList.add("hidden");
};
const handleSearchByName = async (e) => {
  // Reset pagination to default
  pageStart = 0;

  const options = {
    url: `${URL}/users`,
    method: "GET",
    password: adminPassword,
    queryParams: {
      nameFilter: searchInput.value,
      ps: pageStart,
      pc: pageCount,
    },
  };

  // Reset search
  searchInput.value = "";
  const users = await fetchHandler.doRequest(options);
  usersGlobal = users;

  clearUserContainer();

  for (let user of users) {
    addUser(user);
  }
};
const handleSelect = (e) => {
  selectedContainer.classList.remove("hidden");

  if (e.target.tagName === "BUTTON") {
    return;
  }

  const id = e.currentTarget.getAttribute("user-id");
  console.log(id);
  if (window.innerWidth <= 1024) {
    return Router.adminViewSelectedUser(id);
  }

  const selectedUserNew = usersGlobal?.find((e) => e.Id === id);
  console.log(selectedUserNew);
  // Reset transactions
  handleSeeLess();
  updateSelectedStatus(selectedUserNew);
  // Show
  selectedContainer.classList.remove("hidden");
};
const handleGetUserTransactions = async (e) => {
  const options = {
    url: `${URL}/transactions/${e.currentTarget.getAttribute("user-id")}`,
    method: "GET",
    password: adminPassword,
  };

  const transactions = await fetchHandler.doRequest(options);

  // Refresh
  transactionsContainer.textContent = "";
  for (let transaction of transactions) {
    addTransaction(transaction);
  }

  transactionsContainer.classList.remove("hidden");
  seeLess.classList.remove("hidden");
  seeMore.classList.add("hidden");
};
const handleSeeLess = () => {
  transactionsContainer.classList.add("hidden");
  seeMore.classList.remove("hidden");
  seeLess.classList.add("hidden");
};
const handlePageLess = (e) => {
  if (!pageStart) {
    return;
  }
  pageStart -= 1;
  handleGetUsers();
};

const handlePageMore = (e) => {
  if (pageMaxReached) {
    return;
  }
  pageStart += 1;
  handleGetUsers();
};

// Connect handlers
addButton.addEventListener("click", handleAddRedirect);
searchButton.addEventListener("click", handleSearchByName);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearchByName();
  }
});
seeMore.addEventListener("click", handleGetUserTransactions);
seeLess.addEventListener("click", handleSeeLess);
changeSelectButton.addEventListener("click", handleChangeRedirect);
delSelectButton.addEventListener("click", (e) => {
  handleDeleteSelect(e);
});
pageLeft.addEventListener("click", handlePageLess);
pageRight.addEventListener("click", handlePageMore);
// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
console.log(adminPassword);
if (!adminPassword) {
  Router.adminLogin();
}
// Set on load
window.onload = handleGetUsers();
