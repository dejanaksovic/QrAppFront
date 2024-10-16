import { Basket } from "../../assets/Basket";
import { URL } from "../../assets/helpers";
import { PageShifter } from "../../assets/Pageshifter";
import { RequestHandler } from "../../assets/RequestHandler";

// ELEMENTS
const [articlesActivateBtn, basketActivateBtn] = document.querySelectorAll(".selection-tab button");

const articleContainer = document.querySelector(".articles-container");

const wholeRightSide = document.querySelector(".right-side");
const basketContainer = document.querySelector(".basket-container");
const fullValueContainer = document.querySelector(".comulative p:nth-child(2)")

const selectItem = document.querySelector("select");

// Setup pages
const pages = ["main-container", "500"];
const shifter = new PageShifter(pages, "main-container");
// Request handler
const handler = new RequestHandler(shifter, null, "worker");
// Basket
const basket = new Basket(basketContainer, (basket) => {
  fullValueContainer.textContent = basket.price;
});

// ASSETS
let workerPassword = window.sessionStorage.getItem("workerPassword");
let pageStart = 0;
let pageCount = 20;
let globalArticles;
const addArticle = (article) => {
  const articleItem = document.createElement("div");
  articleItem.classList.add("article");
  const image = document.createElement("img");
  image.src = "../../svgs/user-pfp.svg";
  const namePriceContainer = document.createElement("div");
  namePriceContainer.classList.add("name-price");
  const articleName = document.createElement("p");
  articleName.textContent = article.Name;
  const articlePrice = document.createElement("p");
  namePriceContainer.append(articleName, articlePrice);
  const addButton = document.createElement("button");
  addButton.textContent = "DODAJ"
  addButton.setAttribute("article-id", article._id);
  addButton.addEventListener("click", handleAddToBasket);

  articleItem.append(image, namePriceContainer, addButton);

  articleContainer.appendChild(articleItem);
}
const addCategory = (category) => {
  const option = document.createElement("option");
  option.value = category._id;
  option.text = category.Name;

  selectItem.appendChild(option);
}

// Handlers
const handleShowArticles = () => {
  articlesActivateBtn.classList.add("active-button");
  basketActivateBtn.classList.remove("active-button");

  wholeRightSide.classList.add("hidden");
  articleContainer.classList.remove("hidden");
}
const handleShowBasket = () => {
  articlesActivateBtn.classList.remove("active-button");
  basketActivateBtn.classList.add("active-button");

  wholeRightSide.classList.remove("hidden");
  articleContainer.classList.add("hidden");
}
const handleGetArticles = async () => {
  const options = {
    url: `${URL}/articles`,
    method: "GET",
    password: workerPassword,
    queryParams: {
      categoryId: selectItem.value,
      ps: pageStart,
      pc: pageCount,
    }
  }

  const articles = await handler.doRequest(options);
  globalArticles = articles;

  for(let article of articles) {
    addArticle(article);
  }
}
const handleGetCategories = async () => {
  const options = {
    url: `${URL}/categories`,
    method: "GET",
    password: workerPassword,
    queryParams: {
      ps: 0,
      pc: 20,
    }
  }

  const categories = await handler.doRequest(options);

  for(let category of categories) {
    addCategory(category);
  }
}
const handleAddToBasket = async (e) => {
  const id = e.currentTarget.getAttribute("article-id");
  basket.addArticle(globalArticles.find(e => e._id === id));
  fullValueContainer.textContent = basket.price;
}

// Connect handlers
articlesActivateBtn.addEventListener("click", handleShowArticles);
basketActivateBtn.addEventListener("click", handleShowBasket)
selectItem.addEventListener("change", () => {
  // reset
  articleContainer.textContent = "";
  handleGetArticles();
});

// Default
handleGetArticles();
handleGetCategories();