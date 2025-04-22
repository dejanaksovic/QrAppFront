import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// ELEMENTS
const navButtonPhone = document.querySelector(".nav-button");
const navContainer = document.querySelector(".nav-container");
const navButtonInside = document.querySelector(".nav-container svg");

const [ removeButton, currButton, addButton ] = document.querySelectorAll(".button-container button");
let lastOpenButton = currButton;

const editContainer = document.querySelector(".edit-container");
const showContainer = document.querySelector(".show-container");
let lastOpenContainer = showContainer;

const confirmButton = document.querySelector(".confirm");
// ESSENTIALS
// Shifter
const pages = ["main-page", "404", "500"];
const shifter = new PageShifter(pages, "main-page");
// request
const handler = new RequestHandler(shifter, null, "admin");

// Utils
const criticalArticleNames = ["kapucino", "topla čokolada", "nescafe", "ultra", "guarana"];
let globalArticles = [];

let adminPassword;

const operations = ["add", "remove"];
let currOperation = null;

let changePackage = [];

// Util funcs
const getCritical = (articles) => {
  return articles?.filter(e => criticalArticleNames.includes( e?.Name?.toLowerCase() ));
}

const toggleButtons = (newButton) => {
  lastOpenButton.classList.remove("active");
  lastOpenButton = newButton;
  lastOpenButton.classList.add("active");
}
const toggleContainers = (newContainer) => {
  lastOpenContainer.classList.add("hidden");
  lastOpenContainer = newContainer;
  lastOpenContainer.classList.remove("hidden");
}

const populateShowSingle = (article) => {
  const nameItem = document.createElement("p");
  nameItem.textContent = article?.Name;

  const countItem = document.createElement("p");
  countItem.textContent = article?.Count;

  // Reset
  showContainer.append(nameItem, countItem);
}
const populateShow = (articles) => {
  // RESET
  showContainer.textContent = "";
  
  for (let article of articles) {
    populateShowSingle(article);
  }
}

const populateEditSingle = (article) => {
  const nameItem = document.createElement("p");
  nameItem.textContent = article?.Name;

  const newCountItem = document.createElement("input");
  newCountItem.type = "number";
  newCountItem.placeholder = 0;
  newCountItem.addEventListener("keyup", e => {
    const ItemToChange = changePackage.find(e => e?.id === article?._id);
    ItemToChange.count = Number(e.target.value);
  });

  editContainer.append(nameItem, newCountItem);
}
const populateEdit = (articles) => {
  // CLEAR
  editContainer.textContent = "";

  for (let article of articles) {
    populateEditSingle(article);
  }
}

// Handlers
const handleCloseNav = () => {
  navContainer.classList.add("hidden");
}
const handleOpenNav = () => {
  navContainer.classList.remove("hidden");
}

const handleOpenRemove = () => {
  toggleButtons(removeButton);
  toggleContainers(editContainer);
  confirmButton.classList.remove("hidden");
  currOperation = "remove";
}
const handleOpenCurr = () => {
  toggleButtons(currButton);
  toggleContainers(showContainer);
  confirmButton.classList.add("hidden");
  currOperation = null;
}

const handleOpenAdd = () => {
  toggleButtons(addButton);
  toggleContainers(editContainer);
  confirmButton.classList.remove("hidden");
  currOperation = "add";
}

const handleGetAllArticles = async () => {
  const ps = 0;
  const pc = 100;

  const options = {
    password: adminPassword,
    method: "GET",
    queryParams: {
      ps,
      pc,
    },
    url: `${URL}/articles`
  }

  globalArticles = getCritical(await handler.doRequest(options, null));
  
  // Package reset
  changePackage = [];
  // Package population
  for (let article of globalArticles) {
    changePackage.push({
      id: article._id,
      count: 0,
    })
  }

  populateShow(globalArticles);
  populateEdit(globalArticles);
}

const handleChangeSingle = async (singlePackage, operation) => {
  if(!operations.includes(operation)) throw Error("Operation must be of type operation");
  const currArticle = globalArticles.find(e => e._id === singlePackage.id);
  console.log(singlePackage, operation);
  if(!singlePackage.count) return;


  const bodyObject = {
    count: (operation === "add" ? currArticle.Count + singlePackage.count : currArticle.Count - singlePackage.count),
  }
  
  const options = {
    url: `${URL}/articles/${singlePackage.id}`,
    method: "PATCH",
    password: adminPassword,
    body: bodyObject,
  }

  const res = await handler.doRequest(options, `Uspesno dodana kolicina za ${currArticle.Name}`);
}

const handleChange = async (operation) => {
  for (let singlePackage of changePackage) {
    await handleChangeSingle(singlePackage, operation);
  }

  await handleGetAllArticles();
}

const handleConfirm = async () => {
  if(!currOperation) return
  if(!operations.includes(currOperation)) throw Error("Current operation must be of type operation");

  await handleChange(currOperation);
  await handleGetAllArticles();
}

// Connect handlers
navButtonPhone.addEventListener("click", handleOpenNav);
navButtonInside.addEventListener("click", handleCloseNav);

removeButton.addEventListener("click", handleOpenRemove);
currButton.addEventListener("click", handleOpenCurr);
addButton.addEventListener("click", handleOpenAdd);

confirmButton.addEventListener("click", handleConfirm);

adminPassword = sessionStorage.getItem("adminPassword") || localStorage.getItem("adminPassword");
if(!adminPassword) Router.adminLogin();

handleGetAllArticles();