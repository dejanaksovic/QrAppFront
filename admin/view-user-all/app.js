import { FlashMessage } from "../../assets/Flash";
import { getBasePath, URL } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";
// Elements
const usersContainer = document.getElementById("users-container");
const addButton = document.getElementById("add-button");

// pages-setup
const pages = ["main-page", "500"];
const pageShifter = new PageShifter(pages, "main-page");

// Flash message
const flashMessage = new FlashMessage();
// Assets
const addUser = (user) => {
  // user container
  const userContainer = document.createElement("div");
  userContainer.classList.add("user");
  // icon
  const icon = document.createElement("img");
  icon.src = "../../svgs/user-pfp.svg";
  userContainer.appendChild(icon);
  // Name and balance
  const nameAndCoinsContainer = document.createElement("div");
  nameAndCoinsContainer.classList.add("name-and-coins");
  const nameContainer = document.createElement("p");
  nameContainer.id = "name";
  nameContainer.textContent = user.Name;
  const coinsContainer = document.createElement("p");
  coinsContainer.id = "coins";
  coinsContainer.textContent = user.Coins;
  nameAndCoinsContainer.appendChild(nameContainer);
  nameAndCoinsContainer.appendChild(coinsContainer);
  userContainer.appendChild(nameAndCoinsContainer);
  // Buttons
  const delButton = document.createElement("button");
  delButton.classList.add("remove-button");
  delButton.textContent = "OBRISI";
  const changeButton = document.createElement("button");
  changeButton.classList.add("manage-button");
  changeButton.textContent = "IZMENI";
  userContainer.appendChild(delButton);
  userContainer.appendChild(changeButton);
  // Add to main container
  usersContainer.appendChild(userContainer);
}

// Handlers
const handleGetUsers = async () => {
  let res;
  let data; 
  try {
    res = await fetch(`${URL}/users`, {
      headers: {
        "Content-Type" : "application/json",
        "authorization": adminPassword,
      }
    });
    data = await res.json();
    console.log(data);
  }
  catch(err) {
    pageShifter.showPageOnly("500");
  }

  const { users, message } = data;

  // Handle erros
  if(res.status === 401 || res.status === 403) {
    return window.location.assign(`${getBasePath()}/admin/login/index.html`);
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }

  if(message) {
    return flashMessage.showMessage(message, "error");
  }
  
  if(res.ok) {
    // If success populate users
    for (let user of users) {
      addUser(user);
    }
    return;
}
}
const handleAddRedirect = () => {
  window.location.assign(Router.adminAdd);
}

// Connect handlers
addButton.addEventListener("click", handleAddRedirect);

// Default behaviour
const adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}
// Set on load
window.onload = handleGetUsers();
