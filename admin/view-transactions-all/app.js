import {
  URL,
  getTransactionPrecise,
  getTransactionTime,
  pickerDate,
} from "../../assets/helpers.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const transactionsContainer = document.querySelector(".transactions-container");

const [fromTime, toTime] = document.querySelectorAll(".time-picker input");
const dateButton = document.querySelector(".confirm-date");

const [evidentButton, givenButton] = document.querySelectorAll(
  ".type-container button"
);

// NAV
const menuButton = document.querySelector("#nav-menu");
const navButton = document.querySelector("#nav-close");
const nav = document.querySelector("nav");

// shifter
const pages = ["main", "500"];
const shifter = new PageShifter(pages, "main");
// handler
const handler = new RequestHandler(shifter, null, "admin");
// globalTrans
let transGlobal = [];
let showEvidented = {
  value: true,
  setValue: function (value) {
    this.value = value;
    let toShow;
    if (this.value) {
      toShow = transGlobal.filter((trans) => trans.Coins > 0);
      return populateTransactions(toShow);
    }
    toShow = transGlobal.filter((trans) => trans.Coins < 0);
    populateTransactions(toShow);
  },
};

// Utils
const resetTransactions = () => {
  transactionsContainer.textContent = "";
};

const createTimeElem = (date) => {
  if (!date instanceof Date) {
    throw Error("date must be Date");
  }
  const time = getTransactionTime(date);

  const timeElem = document.createElement("div");
  timeElem.classList.add("trans-time");
  timeElem.textContent = time;

  return timeElem;
};
const createNameElem = (transaction) => {
  const nameElem = document.createElement("div");
  nameElem.classList.add("trans-time");
  nameElem.textContent = transaction?.User?.Name;

  return nameElem;
};
const createOrderElem = (order) => {
  const { Article, Quantity } = order || {};

  const info = [Article?.Name, Quantity, Article?.Price * Quantity];

  const orderElem = document.createElement("div");
  orderElem.classList.add("trans-order");

  info.forEach((e) => {
    const infoElem = document.createElement("p");
    infoElem.textContent = e;
    orderElem.appendChild(infoElem);
  });

  return orderElem;
};
const createSumElem = (transaction) => {
  const elem = document.createElement("div");
  elem.classList.add("trans-order");
  const info = ["", "", transaction.Coins];

  info.forEach((e) => {
    const infoElem = document.createElement("p");
    infoElem.textContent = e;
    elem.appendChild(infoElem);
  });

  return elem;
};
const createTransactionElem = (transaction) => {
  const transactionElem = document.createElement("div");
  transactionElem.classList.add("transaction");
  // Time elem
  transactionElem.appendChild(createTimeElem(new Date(transaction.createdAt)));
  transactionElem.appendChild(createNameElem(transaction));
  for (let order of transaction.Order) {
    transactionElem.appendChild(createOrderElem(order));
  }
  transactionElem.appendChild(createSumElem(transaction));

  return transactionElem;
};
const populateTransactions = (transactions) => {
  resetTransactions();
  transactions.forEach((e) => {
    transactionsContainer.appendChild(createTransactionElem(e));
  });
};

const setDefaultDates = () => {
  const todayStart = new Date();
  todayStart.setHours(7, 59);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59);

  fromTime.value = pickerDate(todayStart);
  toTime.value = pickerDate(todayEnd);
};

// HANDLERS
const handleGetTransactions = async (e) => {
  const options = {
    method: "GET",
    url: `${URL}/transactions`,
    password:
      sessionStorage.getItem("adminPassword") ||
      localStorage.getItem("adminPassword"),
    queryParams: {
      dateStart: new Date(new Date(fromTime.value).setHours(7)).toString(),
      dateEnd: new Date(new Date(toTime.value).setHours(23, 59)).toString(),
    },
  };

  transGlobal = await handler.doRequest(options);
  let toShow;
  if (showEvidented.value) {
    toShow = transGlobal.filter((trans) => trans.Coins > 0);
    return populateTransactions(toShow);
  }
  toShow = transGlobal.filter((trans) => trans.Coins < 0);
  populateTransactions(toShow);
};
const handleShowEvidented = (e) => {
  showEvidented.setValue(true);
  evidentButton.classList.add("active");
  givenButton.classList.remove("active");
};
const handleShowGiven = (e) => {
  showEvidented.setValue(false);
  evidentButton.classList.remove("active");
  givenButton.classList.add("active");
};
const handleOpenNav = (e) => {
  nav.style.setProperty("--scale", "1");
};
const handleCloaseNav = (e) => {
  nav.style.setProperty("--scale", "0");
};

// Connect handlers
evidentButton.addEventListener("click", handleShowEvidented);
givenButton.addEventListener("click", handleShowGiven);
dateButton.addEventListener("click", handleGetTransactions);

menuButton.addEventListener("click", handleOpenNav);
navButton.addEventListener("click", handleCloaseNav);

setDefaultDates();
handleGetTransactions();
