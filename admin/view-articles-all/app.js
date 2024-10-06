import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const allArticlesContainer = document.getElementById("all-articles");

const addButton = document.getElementById("button-add");

// setup pages
const pages = ["main-container", "500"];
const pageShifter = new PageShifter(pages, "main-container");
// request handler
const requestHandler = new RequestHandler(pageShifter, null, "admin");
// utils
let adminPassword;
const addArticle = ({Name, Price, _id}) => {
  const articleContainer = document.createElement("div");
  articleContainer.classList.add("article-single-view");
  articleContainer.setAttribute("article-id", _id);
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
  delButton.addEventListener("click", handleDelete);
  delButton.textContent = "OBRIŠI";
  const changeButton = document.createElement("button");
  changeButton.addEventListener("click", handleChange);
  changeButton.textContent = "IZMENI"
  actionContainer.append(delButton, changeButton);
  articleContainer.append(infoContainer, actionContainer);

  // Connect to main
  allArticlesContainer.appendChild(articleContainer);
}

// handlers
const handleGetAll = async () => {
  console.log("hello!");
  const requestOptions = {
    url: `${URL}/articles`,
    method: "GET",
  }

  const { articles } = await requestHandler.doRequest(requestOptions) ?? {articles: null};


  for (let article of articles) {
    addArticle(article);
  }
}
const handleRedirectAdd = async () => {
  return window.location.assign(Router.adminAddArticle);
}
const handleChange = (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("article-id");
  return window.location.assign(`${Router.adminChangeArticle}?id=${id}`);
}
const handleDelete = async (e) => {
  const id = e.target.parentElement.parentElement.getAttribute("article-id");
  const requestOptions = {
    url: `${URL}/articles/${id}`,
    method: "DELETE",
    password: adminPassword,
  }
  const { article } =  await requestHandler.doRequest(requestOptions, "Uspesno obrisan korisnika") ?? { article: null };
  console.log(e.target.parentElement.parentElement);
  if(article) {
    e.target.parentElement.parentElement.remove();
  }
}


// Connect handlers
addButton.addEventListener("click", handleRedirectAdd);

// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}
handleGetAll();