import { getUserIdFromUrl, URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const nameInput = document.getElementById("name-input");
const priceInput = document.getElementById("price-input");
const categorySelect = document.getElementById("category-input");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

const nameElement = document.getElementById("name");
const priceElement = document.getElementById("price");

// utils
let adminPassword;
let id;

// pages setup
const pages = ["500", "main-container", "404"];
const pageShifter = new PageShifter(pages, "main-container");

// handler setup
const requestHandler = new RequestHandler(pageShifter, Router.adminViewAllArticles, "admin");

// assets
const populateCategory = (category) => {
  const categoryElement = document.createElement("option");
  categoryElement.textContent = category.Name;
  categoryElement.value = category._id;

  categorySelect.appendChild(categoryElement);
}

// HANDLERS

const handleGetCategories = async () => {
  const options = {
    url: `${URL}/categories`,
    method: "GET",
    password: adminPassword,
  }

  const categories = await requestHandler.doRequest(options);

  for (let category of categories) {
    populateCategory(category);
  }
}

const handleGet = async () => {
  const requestOptions = {
    url: `${URL}/articles/${id}`,
    method: "GET",
    password: adminPassword,
  }

  const article = await requestHandler.doRequest(requestOptions);
  handleGetCategories();

  if(article) {
    nameElement.textContent = article.Name;
    priceElement.textContent = article.Price;
    return;
  }

}

const handleConfirm = async () => {
  const requestOptions = {
    url: `${URL}/articles/${id}`,
    method: "PATCH",
    password: adminPassword,
    body: {
      name: nameInput.value,
      price: priceInput.value,
      categoryId: categorySelect.value,
    }
  }

  const article = await requestHandler.doRequest(requestOptions, "Artikal uspesno promenjen");
  return;
}

const handleCancel = () =>{
  return Router.adminViewAllArticles();
}
// connect handlers
confirmButton.addEventListener("click", handleConfirm);
cancelButton.addEventListener("click", handleCancel);

// DEFAULT BEHAVIOUR
id = getUserIdFromUrl(window.location.search);
if(!id){
  pageShifter.showPageOnly("404");
  throw Error("Korisnik nije pronadjen");
}
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword)
  window.location.assign(Router.adminLogin);

// Get by default
handleGet();