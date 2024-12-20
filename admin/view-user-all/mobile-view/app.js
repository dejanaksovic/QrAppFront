import { getTransactionTime, getUserIdFromUrl, URL } from "../../../assets/helpers.js";
import { Router } from "../../../assets/PagePaths.js";
import { PageShifter } from "../../../assets/Pageshifter.js";
import { RequestHandler } from "../../../assets/RequestHandler.js";

// Elements
const nameElement = document.getElementById("user-name");
const coinsElement = document.getElementById("user-coins");

const [delButton, changeButton] = document.querySelectorAll(".action-container button");
const navButton = document.getElementById("nav-item");

const transactionContainer = document.getElementById("transactions-container");

// Setup pages
const pages = ["main-container", "500", "404"]
const shifter = new PageShifter(pages, "main-container");
// Setup fetch handler
const fetchHandler = new RequestHandler(shifter, Router.adminViewAllUsers, "admin");

// Assets
let adminPassword = "";
let userId;

const addTransaction = (transaction) => {
  const { Order, createdAt, Coins } = transaction;


  const articlesElement = document.createElement("p");
  const valueElement = document.createElement("p");
  const dateElement = document.createElement("p");

  articlesElement.textContent = Order.reduce((acc, e) => {
    return `${acc} ${e.Article.Name} ${e.Quantity},`; 
  }, "")
  valueElement.textContent = Coins;
  dateElement.textContent = getTransactionTime(new Date(createdAt));

  transactionContainer.append(articlesElement, valueElement, dateElement);
}

// Handlers
const handleGetUserInfo = async (e) => {
  const options = {
    url: `${URL}/users/${userId}`,
    method: "GET",
    password: adminPassword,
  }

  const user = await fetchHandler.doRequest(options);
  
  nameElement.textContent = user.Name;
  coinsElement.textContent = user.Coins;

  // Setup ids  

  handleGetUserTransactions();
}

const handleGetUserTransactions = async(e) => {
  const options = {
    url: `${URL}/transactions/${userId}`,
    method: "GET",
    ps: 0,
    pc: 100,
    password: adminPassword,
  }

  const transactions = await fetchHandler.doRequest(options);

  for (let transaction of transactions) {
    addTransaction(transaction);
  }
}

const handleOpenNav = () => {
  const nav = document.querySelector("nav");

  nav.classList.remove("hidden");
}
const handleChangeRedirect = () => {
  Router.adminChangeUser(userId);
}
const handleDelete = async () => {
  const options = {
    url: `${URL}/users/${userId}`,
    method: "DELETE",
    password: adminPassword,
  }

  const user = await fetchHandler.doRequest(options, "Korisnik uspesno obrisan");

  return Router.adminViewAllUsers();
}


// Connect handlers
navButton.addEventListener("click", handleOpenNav);
delButton.addEventListener("click", handleDelete);
changeButton.addEventListener("click", handleChangeRedirect);
// Default behaviour
userId = getUserIdFromUrl(window.location.search);
if(!userId) {
  shifter.showPageOnly(404);
}
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  Router.adminLogin();
}

handleGetUserInfo();
