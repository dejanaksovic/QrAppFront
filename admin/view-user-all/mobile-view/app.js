import { getTransactionTime, getUserIdFromUrl, URL } from "../../../assets/helpers";
import { PageShifter } from "../../../assets/Pageshifter";
import { RequestHandler } from "../../../assets/RequestHandler";

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
const fetchHandler = new RequestHandler(shifter, undefined, "admin");

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

const handleOpenNav = async => {
  const nav = document.querySelector("nav");

  nav.classList.remove("hidden");
}

// Connect handlers
navButton.addEventListener("click", handleOpenNav);

// Default behaviour
userId = getUserIdFromUrl(window.location.search);
if(!userId) {
  shifter.showPageOnly(404);
}
adminPassword = sessionStorage.getItem("adminPassword");

handleGetUserInfo();
