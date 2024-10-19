import { getTransactionTime, getUserIdFromUrl, URL } from "../assets/helpers.js";
import { PageShifter } from "../assets/Pageshifter.js";
import { RequestHandler } from "../assets/RequestHandler.js";

// Elements
const nameElement = document.getElementById("name");
const coinsElement = document.getElementById("coins");

const transactionContainer = document.querySelector(".transactions");

// Setup pages
const pages = ["main", "500", "404"]
const shifter = new PageShifter(pages, "main");
// Setup fetch handler
const fetchHandler = new RequestHandler(shifter, null, "admin");

// Assets
let userId;

const addTransaction = (transaction) => {
  const { Order, createdAt, Coins } = transaction;

  const singleTrans = document.createElement("div");
  singleTrans.classList.add("single-trans");

  const articlesElement = document.createElement("p");
  const valueElement = document.createElement("p");
  const dateElement = document.createElement("p");

  articlesElement.textContent = Order.reduce((acc, e) => {
    return `${acc} ${e.Article.Name} ${e.Quantity},`; 
  }, "")
  valueElement.textContent = Coins;
  dateElement.textContent = getTransactionTime(new Date(createdAt));

  singleTrans.append(articlesElement, valueElement, dateElement);
  transactionContainer.appendChild(singleTrans);
}

// Handlers
const handleGetUserInfo = async (e) => {
  const options = {
    url: `${URL}/users/${userId}`,
    method: "GET",
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
    pc: 10,
  }

  const transactions = await fetchHandler.doRequest(options);

  for (let transaction of transactions) {
    addTransaction(transaction);
  }
}

// Connect handlers
userId = getUserIdFromUrl(window.location.search);
if(!userId) {
  shifter.showPageOnly("404");
  throw Error("User not found");
}

handleGetUserInfo();
