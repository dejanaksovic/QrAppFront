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
<<<<<<< HEAD

// Default navigate if option exists
if(option === "user") {
  const locationArray = window.location.href.split("/");
  const indexHtml = locationArray.pop();
  locationArray.push("user");
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
}

if(option === "worker") {
  const locationArray = window.location.href.split("/");
  const indexHtml = locationArray.pop();
  locationArray.push("worker");
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
}
=======
>>>>>>> 1b68d7f188453eb64477b4aa2b4e852a2c1f2ce0
