import { Router } from "../../assets/PagePaths.js";

const confirmBtn = document.querySelector("button");

// handler
const setUpWorkerBrowswer = () => {
  localStorage.setItem("isWorker", true);
  Router.base();
}

// connect
confirmBtn.addEventListener("click", setUpWorkerBrowswer);