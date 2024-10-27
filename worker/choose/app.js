import { getUserIdFromUrl } from "../../assets/helpers";
import { Router } from "../../assets/PagePaths";
import { PageShifter } from "../../assets/Pageshifter";

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
