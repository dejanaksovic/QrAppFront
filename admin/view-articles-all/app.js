import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { Popup } from "../../assets/Popup.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const allArticlesContainer = document.getElementById("all-articles");
const helperContainer = document.querySelector(".helper");

const addButton = document.getElementById("button-add");
const delSelectedButton = document.querySelector("#selected-article button:nth-child(1)");
const changeSelectedButton = document.querySelector("#selected-article button:nth-child(2)");

const selectContainer = document.querySelector("select");

const navButton = document.querySelector(".nav-button");
const navItem = document.querySelector(".nav-container");
const hideNav = document.querySelector(".nav-container>svg");

const [prevPage, nextPage] = document.querySelectorAll(".pagination button");

let selectedElement;

// setup pages
const pages = ["main-container", "500"];
const pageShifter = new PageShifter(pages, "main-container");
// request handler
const requestHandler = new RequestHandler(pageShifter, null, "admin");
// popup
const popup = new Popup();
// utils
let adminPassword;
let ps = 0, pc = 30;
let articlesGlobal = [];
let lastCategory = "";
const addArticle = ({Name, Price, _id}) => {
  const articleContainer = document.createElement("div");
  articleContainer.classList.add("article-single-view");
  articleContainer.addEventListener("click", () => {
    handleSelect({Name, Price, _id}, articleContainer);
  });
  // Info contianer
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info");
  // img
  const imageContainer = document.createElement("img");
  imageContainer.src = "../../svgs/user-pfp.svg";
  // nameprice
  const namePriceContainer = document.createElement("div");
  namePriceContainer.classList.add("name-price-container")
  // actuall info
  const nameElement = document.createElement("h2");
  nameElement.textContent = Name;
  const priceElement = document.createElement("p");
  priceElement.textContent = Price;
  // connect nameprice
  namePriceContainer.append(nameElement, priceElement);
  infoContainer.append(imageContainer, namePriceContainer);
  const actionContainer = document.createElement("div");
  actionContainer.classList.add("article-action");
  const delButton = document.createElement("button");
  delButton.setAttribute("article-id", `${_id}`);
  delButton.addEventListener("click", handleDelete);
  delButton.textContent = "OBRIŠI";
  const changeButton = document.createElement("button");
  changeButton.setAttribute("article-id", `${_id}`);
  changeButton.addEventListener("click", handleChange);
  changeButton.textContent = "IZMENI"
  actionContainer.append(delButton, changeButton);
  articleContainer.append(infoContainer, actionContainer);

  // Connect to main
  allArticlesContainer.appendChild(articleContainer);
}

const populateCategories = (category) => {
  const categoryOption = document.createElement("option");
  categoryOption.textContent = category.Name;
  categoryOption.value = category._id;
  selectContainer.appendChild(categoryOption);
}

// handlers
const handleGetAll = async () => {
  // Setup pagination reset
  if(selectContainer.value !== lastCategory) {
    ps = 0;
    lastCategory = selectContainer.value;
  }

  const requestOptions = {
    url: `${URL}/articles`,
    method: "GET",
    queryParams: {
      categoryId: selectContainer.value,
      ps,
      pc,
    }
  }

  const articles = await requestHandler.doRequest(requestOptions) ?? {articles: null};
  articlesGlobal = articles;

  // Refresh
  allArticlesContainer.textContent = "";

  for (let article of articles) {
    addArticle(article);
  }
}
const handleRedirectAdd = async () => {
  return Router.adminAddArticle();
}
const handleChange = (e) => {
  const id = e.target.getAttribute("article-id");
  return Router.adminChangeArticle(id);
}
const handleDelete = async (e) => {
  const id = e.target.getAttribute("article-id");
  // GOD FORBID
  let mainContainer = e.target.closest(".article-single-view");
  if(!mainContainer) {
    mainContainer = selectedElement;
  }
  const requestOptions = {
    url: `${URL}/articles/${id}`,
    method: "DELETE",
    password: adminPassword,
  }
  const article =  await requestHandler.doRequest(requestOptions, "Uspesno obrisan artikal");
  if(mainContainer) {
    mainContainer.remove();
  }
  helperContainer.classList.add("hidden");
}
const handleDeleteSelect = (e) => {
  popup.showPopup("Da li zelite da obrisete artikal", handleDelete, e);
}
const handleSelect = (article, container) => {
  selectedElement = container;
  helperContainer.classList.remove("hidden");
  const selectedName = document.querySelector("#selected-article h1");
  selectedName.textContent = article.Name;
  const selectedPrice = document.querySelector("#selected-article p");
  selectedPrice.textContent = article.Price;
  delSelectedButton.setAttribute("article-id", article._id);
  changeSelectedButton.setAttribute("article-id", article._id);
}
const handleGetCategories = async (e) => {
  const options = {
    url: `${URL}/categories`,
    method: "GET",
    password: adminPassword,
  }
  
  const categories = await requestHandler.doRequest(options);
  for(let category of categories) {
    populateCategories(category);
  }
}
const handleShowNav = () => {
  navItem.classList.remove('hidden');
}
const handleHideNav = () => {
  navItem.classList.add("hidden");
}
const handleNextPage = () => {
  // Returns early if articles on the current page are less then max, shitty solution, but its a solution
  if(articlesGlobal.length < pc) {
    return
  }
  ps+=1;
  handleGetAll();
}
const handlePrevPage = () => {
  if(ps === 0) {
    return;
  }
  pc-=1;
  handleGetAll();
}

// Connect handlers
addButton.addEventListener("click", handleRedirectAdd);
delSelectedButton.addEventListener("click", handleDeleteSelect);
changeSelectedButton.addEventListener("click", handleChange);
selectContainer.addEventListener("change", handleGetAll);
navButton.addEventListener("click", handleShowNav);
hideNav.addEventListener("click", handleHideNav);
nextPage.addEventListener("click", handleNextPage);
prevPage.addEventListener("click", handlePrevPage);

// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  Router.adminLogin();
}

handleGetAll();
handleGetCategories();