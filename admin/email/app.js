import { URL } from "../../assets/helpers.js";
import { Router } from "../../assets/PagePaths.js";
import { PageShifter } from "../../assets/Pageshifter.js";
import { RequestHandler } from "../../assets/RequestHandler.js";

// Elements
const subject = document.getElementById("subject");
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
const handleSendMailAll = async () => {
  console.log(subject.value);
  console.log(message.value);
  console.log(`${URL}/communication/email/all`);
  const options = {
    method: "POST",
    url: `${URL}/communication/email/all`,
    password: adminPassword,
    body: {
      subject: subject.value,
      message: message.value,
    }
  }

  const res = await handler.doRequest(options, "Uspešno poslat mail");
  return;
}
const handleCancel = () => {
  Router.adminViewAllArticles();  
}

// Connect handlers
confirmButton.addEventListener("click", handleSendMailAll);
cancelButton.addEventListener("click", handleCancel);

// Default
if(!adminPassword) {
  Router.adminLogin();
}