// Essentials
import { getUserIdFromUrl } from "./assets/helpers.js";

// Elements
const [buttonWorker, buttonUser] = document.querySelectorAll("button");
const rememberCheckbox = document.querySelector("#remember-option");
// Find id
const id = getUserIdFromUrl(window.location.search);

// Check for options
const option = localStorage.getItem("option");

// Handle worker relocation
buttonWorker.addEventListener("click", e => {
  const locationArray = window.location.href.split("/");
  const indexHtml = locationArray.pop();
  locationArray.push("worker");
  // Save option if needed
  if(rememberCheckbox.checked) {
    localStorage.setItem("option", "worker");
  }
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
}) 

// Handle user relocation
buttonUser.addEventListener("click", e => {
  const locationArray = window.location.href.split("/");
  const indexHtml = locationArray.pop();
  locationArray.push("user");
  // Save option if needed
  if(rememberCheckbox.checked) {
    localStorage.setItem("option", "user");
  }
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
})

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
  locationArray.push("user");
  window.location.assign(`${locationArray.join("/")}/index.html?id=${id}`); 
}