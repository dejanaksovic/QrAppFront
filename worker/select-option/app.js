// ELEMENTS
import { getUserIdFromUrl } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";

const [addOrderButton, chargeOrderButton] = document.querySelectorAll("button");

let id;

const pages = ["main", "404"];
const shifter = new PageShifter(pages, "main");

// Handlers
const handleRedirectToAdd = () => {
  return Router.workerAdd(id);
}

const handleRedirectCharge = () => {
  return Router.workerCharge(id);
}

// Connect handlers
addOrderButton.addEventListener("click", handleRedirectToAdd);
chargeOrderButton.addEventListener("click", handleRedirectCharge);

// Default behaviour
id = getUserIdFromUrl(window.location.search);
console.log(id);
if(!id) {
  shifter.showPageOnly("404");
  throw Error("Id not given");
}