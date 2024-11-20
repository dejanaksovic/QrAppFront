import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const nameInput = document.getElementById("name-input");
const priceInput = document.getElementById("price-input");
const incrementInput = document.getElementById("increment-input");
const selectElement = document.getElementById("category-input");

const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

// utils
let adminPassword;

// page setup
const pages = ["main-container", "500"];
const pageShifter = new PageShifter(pages, "main-container");

// fetchHandler
const fetchHandler = new RequestHandler(pageShifter, Router.adminViewAllArticles, "admin");

// Assets
const addCategory = (category) => {
  const categoryOption = document.createElement("option");
  categoryOption.textContent = category.Name;
  categoryOption.value = category._id;

  selectElement.appendChild(categoryOption);
}

// HANDLERS
const handleConfirm = async (e) => {
  const options = {
    method: "POST",
    url: `${URL}/articles`,
    password: adminPassword,
    body: {
      name: nameInput.value,
      price: priceInput.value,
      increment: Number(incrementInput.value) / 100,
      categoryId: selectElement.value,
    }
  }

  await fetchHandler.doRequest(options, "Uspesno kreiran artikal");
}
const handleCancel = () => {
  Router.adminViewAllArticles();
}
const handleGetCategories = async () => {
  const options = {
    url: `${URL}/categories`,
    method: "GET",
    password: adminPassword,
  }

  const categories = await fetchHandler.doRequest(options);

  for(let category of categories) {
    addCategory(category);
  }
}

// connect handlers
confirmButton.addEventListener("click", handleConfirm);
cancelButton.addEventListener("click", handleCancel);

// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  Router.adminLogin();
}

handleGetCategories();