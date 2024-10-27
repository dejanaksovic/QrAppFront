import { getUserIdFromUrl } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";

const [chargeButton, addButton] = document.querySelectorAll("button");

// pages
const pages = ["main", "404"]
const shifter = new PageShifter(pages, "main");

// assets
const id = getUserIdFromUrl(window.location.search);

// handlers
chargeButton.addEventListener("click", () => {
  Router.workerCharge(id);
})
addButton.addEventListener("click", (e) => {
  Router.workerAdd(id);
})

// Defaults
if(!id) {
  shifter.showPageOnly("404");
  throw Error("User not found");
}
