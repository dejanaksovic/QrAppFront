import { getTransactionTime, getUserIdFromUrl, URL } from "../assets/helpers";
import { PageShifter } from "../assets/Pageshifter";
import { RequestHandler } from "../assets/RequestHandler";

// Elements
const nameElement = document.querySelector("#name");
const coinsElement = document.querySelector("#coins");

const transactionsElement = document.querySelector(".transactions");

// Page setup
const pages = ["main", "404", "500"];
const shifter = new PageShifter(pages, "main");
// request handler
const handler = new RequestHandler(shifter, null, "user");
// assets
let id;
const addTransaction = (transaction) => {
  const { Order, createdAt, Coins } = transaction;

  const transactionContainer = document.createElement("div");
  transactionContainer.classList.add("single-trans");
  const transactionItems = document.createElement("p");
  for(let order of Order) {
    transactionItems.textContent += `${order.Quantity} ${order.Article.Name}`;
  }
  const coinsItem = document.createElement("p");
  coinsItem.textContent = Coins;
  const dateItem = document.createElement("p");
  dateItem.textContent = getTransactionTime(new Date(createdAt));
  transactionContainer.append(transactionItems, coinsItem, dateItem);

  transactionsElement.appendChild(transactionContainer);
}

// Handlers
const handleGetUser = async () => {
  const options = {
    url: `${URL}/users/${id}`,
    method: "GET",
  }

  const user = await handler.doRequest(options);

  nameElement.textContent = user.Name;
  coinsElement.textContent = user.Coins;
}
const handleGetTransactions = async () => {
  const options = {
    url: `${URL}/transactions/${id}`,
    method: "GET",
    queryParams: {
      ps: 0,
      pc: 10,
    }
  }

  const transactions = await handler.doRequest(options);
  
  for(let transaction of transactions) {
    console.log(transaction)
    addTransaction(transaction);
  }
}

// Default
id = getUserIdFromUrl(window.location.search);
if(!id) {
  shifter.showPageOnly("404");
  throw Error("User not found");
}
handleGetUser();
handleGetTransactions();