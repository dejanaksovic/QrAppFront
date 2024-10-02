import { PageShifter } from "../../assets/Pageshifter";

// ELEMENTS
const passwordInput = document.getElementById("password");
const togglePasswordInputType = document.getElementById("toggle-pass");
const rememberMeInput = document.getElementById("remember-me");

const loginButton = document.getElementById("login-btn");

// pages setup
const pages = ["main-page", "500"];
const pageShifter = new PageShifter(pages, "main-page");
