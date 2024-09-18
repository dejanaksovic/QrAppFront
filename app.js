// Essentials
import { getUserIdFromUrl } from "./assets/helpers";

// Elements
const [buttonWorker, buttonUser] = document.querySelectorAll("button");

// Find id
const id = getUserIdFromUrl(window.location.search);

// Handle worker relocation
buttonWorker.addEventListener("click", e => {
  const locationArray = window.location.href.split("/");
  const indexHtml = locationArray.pop();
  locationArray.push("worker");
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
}) 

// Handle user relocation
buttonUser.addEventListener("click", e => {
  const locationArray = window.location.href.split("/");
  const indexHtml = locationArray.pop();
  locationArray.push("user");
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
})