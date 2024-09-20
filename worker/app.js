import { FlashMessage } from "../assets/Flash.js";
import { PageShifter } from "../assets/Pageshifter.js";
import { URL, getUserIdFromUrl } from "../assets/helpers.js";
import { articleNames } from "../assets/helpers.js";

//Initialize basket 
const basket = [];
articleNames.forEach(articleName => {
  basket.push({
    name: articleName,
    quantity: 0,
  })
})
// Init password
let password;
// Init id
let id;
console.log(basket);
// Stup pages
const pages = ["404", "500", "login-page", "main-page"];
const pageShifter = new PageShifter(pages, "login-page");

// Stup flash
const flashMesage = new FlashMessage("flash");

// Elements
const loginButton = document.getElementById("login-button");
const loginInput = document.getElementById("password-input");

const menuContainer = document.getElementById("menu-container");
const basketElement = document.getElementById("basket");

const addOrderButton = document.getElementById("order-add");
const chargeForOrderButton = document.getElementById("order-pay");
// Could be god knows how meny articles, thats why async
const addArticle = (name) => {
  const elem = basket.find(e => e.name === name);
  if(!elem)
    throw Error("Item doesn't exist");
  if(elem.quantity === 0) {
    elem.quantity+=1;
    // Craete elements neccessary;
    const articleNameElement = document.createElement("div");
    articleNameElement.classList.add("font-color");
    articleNameElement.textContent = name.split("-").join(" ").toUpperCase();
    const articleQuantityElement = document.createElement("div");
    articleQuantityElement.classList.add("font-color");
    articleQuantityElement.textContent = 1;
    articleQuantityElement.setAttribute("quantity-for", name);
    // button container
    const buttonContainer = document.createElement("div");
    const articleDeleteButton = document.createElement("button");
    articleDeleteButton.textContent = "X";
    articleDeleteButton.classList.add("button-delete", "bg-error", "default-box-shadow");
    articleDeleteButton.addEventListener("click", e => {
      // Count set to 0
      elem.quantity = 0;
      // Remove elements from dom;
      buttonContainer.remove();
      articleNameElement.remove();
      articleQuantityElement.remove();
      articleDeleteButton.remove();
    })
    buttonContainer.appendChild(articleDeleteButton);
    // push elements inside DOM
    basketElement.appendChild(articleNameElement);
    basketElement.appendChild(articleQuantityElement);
    basketElement.appendChild(buttonContainer);

    return;
  }
  elem.quantity += 1;
  const elementToUpdateQuantity = document.querySelector(`[quantity-for=${name}]`);
  elementToUpdateQuantity.textContent = elem.quantity;
}
const populateMenu = async () => {
  articleNames.forEach(articleName => {
    // Name transofrm
    const nameToShow = articleName.toUpperCase().split("-").join(" ");
    // Single article container
    const container = document.createElement("div");
    container.addEventListener("click", e => {
      addArticle(articleName);
    })
    container.classList.add("default-box-shadow");
    // Article image
    const image = document.createElement("img");
    image.src = `../svgs/${articleName}.svg`;
    container.appendChild(image);
    // Article name
    const articleNameContainer = document.createElement("p");
    articleNameContainer.textContent = nameToShow;
    container.appendChild(articleNameContainer);
    menuContainer.appendChild(container);
  })
}

// Init password form local storage if exists;
const handleLogin = async () => {
  if(!password) {
    password = loginInput.value;
  }

  let res;
  let data;

  try {
    res = await fetch(`${URL}/users/login/worker`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : password,
      }
    });
  }
  catch(err) {
    // Refresh password
    console.log(err);
    localStorage.removeItem("passwork-worker");
    password = ""
    return pageShifter.showPageOnly("500");
  }

  if(res.ok) {
    return pageShifter.showPageOnly("main-page");
  }

  if(res.status === 500) {
    password = "";
    return pageShifter.showPageOnly("500");
  }

  if(res.status === 401 || res.status === 403) {
    password = "";
    return flashMesage.showMessage("Pogresna sifra", "error");
  }
}
const handleAddOrder = async() => {
  let res;
  let data;

  try {
    console.log(password);
    res = await fetch(`${URL}/users/order/${id}`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : password,
      },
      body: JSON.stringify({articlesOrdered: basket}),
    });
    data = await res.json();
    // Clear basket
    basket.forEach( e => {
      e.quantity = 0;
    })
    basketElement.textContent = "";
  }
  catch(err) {
    // Clear basket
    basket.forEach( e => {
      e.quantity = 0;
    })
    basketElement.textContent = "";
    password = "";
    pageShifter.showPageOnly(500);
    return;
  }

  const { message } = data;

  if(res.ok) {
    return flashMesage.showMessage("Porudzbina uspesno dodata", "success");
  }

  if(res.status === 404) {
    return pageShifter.showPageOnly("404");
  }

  if(message) {
    return flashMesage.showMessage(message, "error")
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }
} 
const handleChargeForOrder = async () => {
  let res;
  let data;

  try {
    console.log(password);
    res = await fetch(`${URL}/users/buy/${id}`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : password,
      },
      body: JSON.stringify({articlesToBuy: basket}),
    });
    data = await res.json();
    // Clear basket
    basket.forEach( e => {
      e.quantity = 0;
    })
    basketElement.textContent = "";
  }
  catch(err) {
    // Clear basket
    basket.forEach( e => {
      e.quantity = 0;
    })
    basketElement.textContent = "";
    password = "";
    pageShifter.showPageOnly(500);
    return;
  }

  const { message } = data;

  if(res.ok) {
    return flashMesage.showMessage("Porudzbina uspesno naplacena", "success");
  }

  if(res.status === 404) {
    return pageShifter.showPageOnly("404");
  }

  if(message) {
    return flashMesage.showMessage(message, "error")
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }
}

// Connect handlers
loginButton.addEventListener("click", handleLogin);
addOrderButton.addEventListener("click", handleAddOrder);
chargeForOrderButton.addEventListener("click", handleChargeForOrder);

// Default behaviour
id = getUserIdFromUrl(window.location.search);
password = localStorage.getItem("password-worker");
if(!id) {
  pageShifter.showPageOnly("404");
  throw Error("Not found user");
}

populateMenu();
