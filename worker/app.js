import { FlashMessage } from "../assets/Flash.js";
import { PageShifter } from "../assets/Pageshifter.js";
import { URL, getUserIdFromUrl } from "../assets/helpers.js";
import { articleNames } from "../assets/helpers.js";

//Initialize basket 
const basket = [];
articleNames.forEach(articleName => {
  basket.push({
    name: articleName.name,
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

const nameContainer = document.getElementById("name-container");
const coinsContainer = document.getElementById("balance-container");

const toAddContainer = document.getElementById("coins-add-value");
const toRemoveCointainer = document.getElementById("coins-remove-value");

const menuContainer = document.getElementById("menu-container");
const basketElement = document.getElementById("basket");

const addOrderButton = document.getElementById("order-add");
const chargeForOrderButton = document.getElementById("order-pay");
// Could be god knows how meny articles, thats why async
// Update price status
const updatePriceStatus = () => {
  let initAdd = 0;
  let initRemove = 0;
  basket.forEach(e => {
    let itemBase;
    for(let item of articleNames) {
      if(item.name === e.name)
        itemBase = item;
    }
    if(!itemBase) {
      throw Error(`Item ${e.name} not found in base articles`);
    }
    initAdd += e.quantity * itemBase.price;
    initRemove += e.quantity * itemBase.buyPrice;
  })
  toAddContainer.textContent = initAdd;
  toRemoveCointainer.textContent = initRemove;
}
const addArticle = (name) => {
  const elem = basket.find(e => e.name === name);
  if(!elem)
    throw Error(`Item ${name} doesn't exist`);
  elem.quantity+=1;
  if(elem.quantity-1 === 0) {
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
      updatePriceStatus();
    })
    buttonContainer.appendChild(articleDeleteButton);
    // push elements inside DOM
    basketElement.appendChild(articleNameElement);
    basketElement.appendChild(articleQuantityElement);
    basketElement.appendChild(buttonContainer);
    updatePriceStatus();
    return;
  }
  const quantityElement = document.querySelector(`[quantity-for=${name}]`);
  quantityElement.textContent = elem.quantity;
  updatePriceStatus();
}
const populateMenu = async () => {
  articleNames.forEach(articleName => {
    // Name transofrm
    const nameToShow = articleName.name.toUpperCase().split("-").join(" ");
    // Single article container
    const container = document.createElement("div");
    container.addEventListener("click", e => {
      addArticle(articleName.name);
    })
    container.classList.add("default-box-shadow");
    // Article image
    const image = document.createElement("img");
    image.src = `../svgs/${articleName.name}.svg`;
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
    localStorage.removeItem("passwork-worker");
    password = ""
    return pageShifter.showPageOnly("500");
  }

  if(res.ok) {
    return await handleGetUser();
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
const handleGetUser = async () => {
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : `${password}`,
      }
    });
    data = await res.json();
  }
  catch(err) {
    return pageShifter.showPageOnly("500");
  }

  const { message, user } = data;

  if(res.ok) {
    nameContainer.textContent = user.Name;
    coinsContainer.textContent = user.Coins;
    pageShifter.showPageOnly("main-page");
    return;
  }

  if(res.status === 404) {
    console.log("Hey not found");
    pageShifter.showPageOnly("404");
    return
  }
  
  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }

  return flashMesage.showMessage(message, "error");
}
const handleAddOrder = async() => {
  let res;
  let data;

  try {
    console.log("Hey im in");
    const articlesOrdered = basket.reduce((acc, e) => {
      if(e.quantity === 0)
        return acc;
      acc.push(e);
      return acc;
    }, []);
    res = await fetch(`${URL}/users/order/${id}`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : password,
      },
      body: JSON.stringify({articlesOrdered}),
    });
    data = await res.json();
    // Clear basket
    basket.forEach( e => {
      e.quantity = 0;
    })
    basketElement.textContent = "";
    updatePriceStatus();
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
    handleGetUser();
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
    const articlesToBuy = basket.reduce((acc, e) => {
      if(e.quantity === 0)
        return acc;
      acc.push(e);
      return acc;
    }, [])
    res = await fetch(`${URL}/users/buy/${id}`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : password,
      },
      body: JSON.stringify({articlesToBuy}),
    });
    data = await res.json();
    // Clear basket
    basket.forEach( e => {
      e.quantity = 0;
    })
    basketElement.textContent = "";
    updatePriceStatus();
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
    handleGetUser();
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
