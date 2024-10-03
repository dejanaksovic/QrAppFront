import { getBasePath, getUserIdFromUrl, URL } from "../../assets/helpers";
import { PageShifter } from "../../assets/Pageshifter";
import { Router } from "../../assets/PagePaths";

// ELEMENTS
const nameInput = document.getElementById("name-input");
const balanceInput = document.getElementById("balance-input");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

// Pages setup
const pages = ["main-container", "404", "500"]
const pageShifter = new PageShifter(pages, "main-container");

// HANDLERS 
const handleCancel = () => {
  window.location.assign(Router.adminViewAllUsers);
}
const handleChange = async () => {
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type" : "application/json",
        "authorization" : `${adminPassword}`,
      },
      body: JSON.stringify({
        name: nameInput.value,
        balance: balanceInput.value
      })
    });
    data = await res.json();
  }
  catch(err) {
    console.log(err);
    return pageShifter.showPageOnly("500");
  }

  const { user, message } = data;

  if(res.ok) {
    return window.location.assign(Router.adminViewAll);
  }

  if(res.status === 401 || res.status === 403) {
    sessionStorage.removeItem("adminPassword");
    localStorage.removeItem("adminPassword");
    return window.location.assign(Router.adminLogin);
  }

  if(res.status === 404) {
    return pageShifter.showPageOnly("404");
  }

  if(res.status === 500) {
    return pageShifter.showPageOnly("500");
  }
}

// ASSIGN HANDLERS
cancelButton.addEventListener("click", handleCancel);
confirmButton.addEventListener("click", handleChange);

// DEFAULT BEHAVIOUR
const id = getUserIdFromUrl(window.location.search);
if(!id) {
  pageShifter.showPageOnly("404");
  throw Error("User not found");
}

const adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}