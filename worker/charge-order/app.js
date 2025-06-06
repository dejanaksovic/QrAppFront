import { Basket } from "../../assets/Basket.js";
import { getUserIdFromUrl, URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const [articlesActivateBtn, basketActivateBtn] = document.querySelectorAll(
  ".selection-tab button"
);

const [ leftArow, rightArrow ] = document.querySelectorAll(".pagination img");

const articleContainer = document.querySelector(".articles-container");

const wholeRightSide = document.querySelector(".right-side");
const wholeLeftSide = document.querySelector(".left-side");

const basketContainer = document.querySelector(".basket-container");
const fullValueContainer = document.querySelector(".comulative p:nth-child(2)");

const selectItem = document.querySelector("select");

const confirmButton = document.querySelector("#confirm");

// Setup pages
const pages = ["wrapper", "500", "404"];
const shifter = new PageShifter(pages, "wrapper");
// Request handler
const handler = new RequestHandler(shifter, null, "worker");
// Basket
const basket = new Basket(basketContainer, (basket) => {
  fullValueContainer.textContent = basket.price;
});

// ASSETS
let workerPassword =
  sessionStorage.getItem("workerPassword") ??
  localStorage.getItem("workerPassword");
let pageStart = 0;
let pageCount = 20;
let globalArticles;
let userId;

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
  addButton.textContent = "DODAJ";
  addButton.setAttribute("article-id", article._id);
  addButton.addEventListener("click", handleAddToBasket);

  articleItem.append(image, namePriceContainer, addButton);

  articleContainer.appendChild(articleItem);
};
const addCategory = (category) => {
  const option = document.createElement("option");
  option.value = category._id;
  option.text = category.Name;

  selectItem.appendChild(option);
};

// Handlers
const handleShowArticles = () => {
  articlesActivateBtn.classList.add("active-tab");
  basketActivateBtn.classList.remove("active-tab");

  wholeRightSide.classList.add("hidden");
  wholeLeftSide.classList.remove("hidden");
};
const handleShowBasket = () => {
  articlesActivateBtn.classList.remove("active-tab");
  basketActivateBtn.classList.add("active-tab");

  wholeRightSide.classList.remove("hidden");
  wholeLeftSide.classList.add("hidden");
};
const handleGetArticles = async () => {
  const options = {
    url: `${URL}/articles`,
    method: "GET",
    password: workerPassword,
    queryParams: {
      categoryId: selectItem.value,
      ps: pageStart,
      pc: pageCount,
    },
  };

  const articles = await handler.doRequest(options);
  globalArticles = articles;

  // Clear
  articleContainer.textContent = "";

  for (let article of articles) {
    addArticle(article);
  }
};
const handleGetCategories = async () => {
  const options = {
    url: `${URL}/categories`,
    method: "GET",
    password: workerPassword,
    queryParams: {
      ps: 0,
      pc: 20,
    },
  };

  const categories = await handler.doRequest(options);

  for (let category of categories) {
    addCategory(category);
  }
};
const handleAddToBasket = async (e) => {
  const id = e.currentTarget.getAttribute("article-id");
  basket.addArticle(globalArticles.find((e) => e._id === id));
  fullValueContainer.textContent = basket.price;

  // Show message
  handler.flash.showMessage("Artikal dodat", "success");
};
const handleConfirmOrder = async (e) => {
  const options = {
    url: `${URL}/transactions`,
    method: "POST",
    password: workerPassword,
    body: {
      order: basket.basket,
      userId: userId,
      type: "remove",
    },
  };

  const res = await handler.doRequest(options, "Uspešno naplaćeno korisniku");
  basket.reset();
  fullValueContainer.textContent = basket.price;
};
const handlePaginateRight = () => {
  if(globalArticles.length < pageCount) return;

  pageStart++;
  handleGetArticles();
}
const handlePaginateLeft = () => {
  if(pageStart === 0) return;

  pageStart --;
  handleGetArticles();
}

// Connect handlers
articlesActivateBtn.addEventListener("click", handleShowArticles);
basketActivateBtn.addEventListener("click", handleShowBasket);
selectItem.addEventListener("change", () => {
  // reset
  articleContainer.textContent = "";
  handleGetArticles();
});
confirmButton.addEventListener("click", handleConfirmOrder);
leftArow.addEventListener("click", handlePaginateLeft);
rightArrow.addEventListener("click", handlePaginateRight);

// Default
userId = getUserIdFromUrl(window.location.search);
if (!userId) {
  shifter.showPageOnly("404");
  throw Error("User not found");
}
if (!workerPassword) {
  Router.workerLogin(userId);
}
handleGetArticles();
handleGetCategories();
