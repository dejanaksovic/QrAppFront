import { getUserIdFromUrl } from "./assets/helpers";
import { Router } from "./assets/PagePaths";
import { PageShifter } from "./assets/Pageshifter";

const isWorker = localStorage.getItem("isWorker")
const id = getUserIdFromUrl(window.location.search);
console.log(isWorker, Boolean(isWorker));
// pages
const pages = ["empty", "404", "500"];
const shifter = new PageShifter(pages, "empty");

window.addEventListener("load", () => {
  if(!id) {
    shifter.showPageOnly("404");
    throw Error("Korisnik nije pronadjen")
  }
  if(isWorker) {
    return Router.workerChoose(id);
  }
  Router.userView(id);
})
