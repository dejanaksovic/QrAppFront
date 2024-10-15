import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const allArticlesContainer = document.getElementById("all-articles");
const selectedArticleContainer = document.getElementById("selected-article");
const helperContainer = document.querySelector(".helper");

const addButton = document.getElementById("button-add");
const delSelectedButton = document.querySelector("#selected-article button:nth-child(1)");
const changeSelectedButton = document.querySelector("#selected-article button:nth-child(2)");

let selectedElement;

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

// handlers
const handleGetAll = async () => {
  const requestOptions = {
    url: `${URL}/articles`,
    method: "GET",
    queryParams: {
      ps: 0,
      pc: 30,
    }
  }

  const articles = await requestHandler.doRequest(requestOptions) ?? {articles: null};

  console.log(articles);

  for (let article of articles) {
    addArticle(article);
  }
}
const handleRedirectAdd = async () => {
  return window.location.assign(Router.adminAddArticle);
}
const handleChange = (e) => {
  const id = e.target.getAttribute("article-id");
  return window.location.assign(`${Router.adminChangeArticle}?id=${id}`);
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
  const article =  await requestHandler.doRequest(requestOptions, "Uspesno obrisan korisnika");
  if(article) {
    mainContainer.remove();
  }
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



// Connect handlers
addButton.addEventListener("click", handleRedirectAdd);
delSelectedButton.addEventListener("click", e => {
  handleDelete(e);
  helperContainer.classList.add("hidden");
});
changeSelectedButton.addEventListener("click", handleChange);

// Default behaviour
adminPassword = sessionStorage.getItem("adminPassword");
if(!adminPassword) {
  window.location.assign(Router.adminLogin);
}
handleGetAll();