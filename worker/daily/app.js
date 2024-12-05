import { getTransactionPrecise, URL } from "../../assets/helpers.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// shifter
const pages = ["main", "500"]
const shifter = new PageShifter(pages, "main");
// handler
const handler = new RequestHandler(shifter, null, 'worker');

// Elements 
const transactionContainer = document.querySelector(".transaction-container");

// Utils
const password = sessionStorage.getItem("workerPassword");
// Order creation
const createTransactionDate = (date) => {
  const dateContainer = document.createElement("div");
  dateContainer.classList.add("date");
  dateContainer.textContent = getTransactionPrecise(new Date(date));

  return dateContainer;
}

const createOrderItem = (orderItem) => {
  const { Article, Quantity } = orderItem || {};

  const info = [Article, Quantity, Number(Article.Price) * Number(Quantity)];
  const elems = [];

  info.forEach(e => {
    const elem = document.createElement("div");
    elem.textContent = e?.Name || e;
    elems.push(elem);
  })

  return elems;
}

const createOrder = (order) => {
  const orderElem = document.createElement("div");
  orderElem.classList.add("order-container");

  let fullPrice = 0;

  order.forEach(orderItem => {
    const infoElems = createOrderItem(orderItem);
    infoElems.forEach(infoElem => {
      orderElem.appendChild(infoElem);
    })
    fullPrice+= orderItem?.Article?.Price * orderItem?.Quantity;
  })
  // Extra append for sum
  const sumElem = document.createElement("div");
  sumElem.textContent = fullPrice;
  orderElem.append(document.createElement("div"), document.createElement("div"), sumElem);

  return orderElem;
}

const createTransaction = (transaction) => {
  const transactionElem = document.createElement("div");
  transactionElem.classList.add("transaction");

  const dateElem = createTransactionDate(transaction.createdAt);
  const orderElem = createOrder(transaction.Order);
  transactionElem.append(dateElem, orderElem);

  return transactionElem;
}

const appendTransactions = (transactions) => {
  transactions.forEach(transaction => {
    if(transaction.Coins > 0) {
      return;
    }
    transactionContainer.appendChild(createTransaction(transaction));
  })
}

// Handlers
const handleGetTransactions = async (e) => {
  const options = {
    url: `${URL}/transactions/daily`,
    method: "GET",
    password
  }

  const transactions = await handler.doRequest(options, );

  appendTransactions(transactions);
}

handleGetTransactions();
