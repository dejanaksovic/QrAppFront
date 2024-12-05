import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// Elements
const message = document.getElementById("message");

const [confirmButton, cancelButton] = document.querySelectorAll(".action button");

// Pages setup
const pages = ["main", "500"];
const shifter = new PageShifter(pages, "main");

// Handler
const handler = new RequestHandler(shifter, null, "admin");
// Helpers
const adminPassword = sessionStorage.getItem("adminPassword");

// Handlers
const handleSendPhoneAll = async () => {
  const options = {
    method: "POST",
    url: `${URL}/communication/phone/all`,
    password: adminPassword,
    body: {
      content: message.value,
    }
  }

  const res = await handler.doRequest(options, "Uspešno poslata poruka");
  return;
}
const handleCancel = () => {
  Router.adminViewAllArticles();  
}

// Connect handlers
confirmButton.addEventListener("click", handleSendPhoneAll);
cancelButton.addEventListener("click", handleCancel);

// Default
if(!adminPassword) {
  Router.adminLogin();
}