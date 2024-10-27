import { URL, getTransactionTime } from "../../assets/helpers.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const transactionsContainer = document.querySelector(".transaction-div");

const [fromDate, toDate] = document.querySelectorAll("input[type=date]");
const searchElement = document.querySelector("button");
// Pages setup
const pages = ["main", "500"];
const shifter = new PageShifter(pages, "main");

// Request handler
const handler = new RequestHandler(shifter, null, "admin");

// Assets
let adminPassword;
let ps = 0, pc = 100;
const setDefaultsForDates = () => {
// Set max dates and default date
  const nowDate = new Date(new Date().getTime() - 24*60*60*1000);
  const tommorowDate = new Date(nowDate.getTime() + 24*60*60*1000);

  const yearNow = nowDate.getFullYear();
  const monthNow = String(nowDate.getMonth()+1).padStart(2, "0");
  const dayNow = String(nowDate.getDate()).padStart(2, "0");
  const nowDateFormat = `${yearNow}-${monthNow}-${dayNow}`;
  fromDate.value = nowDateFormat;
  fromDate.value = nowDateFormat;

  const yearTommorow = tommorowDate.getFullYear();
  const monthTommorow = String(tommorowDate.getMonth()+1).padStart(2, "0");
  const dayTommorow = String(tommorowDate.getDate()).padStart(2, "0");
  const tommorowDateFormat = `${yearTommorow}-${monthTommorow}-${dayTommorow}`;
  toDate.value = tommorowDateFormat;
  toDate.max = tommorowDateFormat;
}

const clearTransactions = () => {
  const existingTrnasactions = transactionsContainer.querySelectorAll(".transaction");
  existingTrnasactions.forEach((e, i) => {
    if(i) {
      e.remove();
    }
  })
}

const addTransaction = (transaction) => {
  const { Order, createdAt, Coins} = transaction;
  
  const singleTrans = document.createElement("div");
  singleTrans.classList.add("transaction");
  
  const userName = document.createElement("p");
  const order = document.createElement("p");
  const coins = document.createElement("p");
  const date = document.createElement("p");
  
  userName.textContent = transaction?.User?.Name;
  order.textContent = Order.reduce((acc, e) => {
    return `${acc} ${e?.Article?.Name} ${e.Quantity},`; 
  }, "")
  coins.textContent = Coins;
  date.textContent = getTransactionTime(new Date(createdAt));
  singleTrans.append(userName, order, coins, date);
  transactionsContainer.appendChild(singleTrans);
}

// Handlers
const handleGetTransactions = async (e) => {
  const options = {
    url: `${URL}/transactions`,
    method: "GET",
    password: adminPassword,
    queryParams: {
      dateStart: fromDate.value,
      dateEnd: toDate.value,
      ps,
      pc
    }
  }

  const transactions = await handler.doRequest(options);
  // Default clear
  clearTransactions();
  for(let transaction of transactions) {
    addTransaction(transaction);
  }
}

// Connect handlers
searchElement.addEventListener("click", handleGetTransactions);

setDefaultsForDates();
handleGetTransactions();