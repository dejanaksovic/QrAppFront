import { FlashMessage } from "../assets/Flash";
import { showElement, hideElement, URL } from "../assets/helpers";
import { PageShifter } from "../assets/Pageshifter";
// Page names
const pageNames = ["login-page", "view-page", "500", "create page"];
// ELEMENTS
const loginButton = document.getElementById("login-button");
const passwordInput = document.getElementById("password");
const usersContainer = document.getElementById("user-container")

// 500
const serverErrorPage = document.getElementById("500");
// Flash
const flashMessage = new FlashMessage("flash");
// Setup page shifter
const pageShifter = new PageShifter(pageNames, "login-page");

// Populate users;
const populateUsers = (users) => {
  users.forEach(e => {
    // Create element for user
    const nameContainer = document.createElement("p");
    nameContainer.textContent = e.Name;
    usersContainer.appendChild(nameContainer);
    // Edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button", "bg-warning", "default-box-shadow");
    editButton.setAttribute("user-id", e._id);
    const editImage = document.createElement("img");
    editImage.src = "../svgs/screwdriver-tools-construction-flathead-repair-tool-equipment-svgrepo-com.svg";
    editButton.appendChild(editImage);
    usersContainer.appendChild(editButton);
    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("remove-button", "bg-error", "default-box-shadow");
    deleteButton.setAttribute("user-id", e._id);
    const deleteImage = document.createElement("img");
    deleteImage.src = "../svgs/user-delete-svgrepo-com.svg";
    deleteButton.appendChild(deleteImage);
    usersContainer.appendChild(deleteButton);
    console.log(usersContainer);
  })
}

const requestUsers = async () => {
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users`, {
      headers: {
        "content-type": "application/json",
        "authorization":`${passwordInput.value}`,
      }
    });
    data = await res.json();
  }
  catch(err) {
    pageShifter.showPageOnly("500");
    return;
  }

  const { users, message } = data;

  // Handle errors
  if(res.status === 500) {
    pageShifter.showPageOnly("500");
    return;
  }

  if(res.status === 401) {
    flashMessage.showMessage("Pogresna sifra", "error");
    return;
  }

  if(message) {
    return flashMessage.showMessage(message);
  }

  populateUsers(users);
  pageShifter.showPageOnly("view-page");
  
}

loginButton.addEventListener("click", requestUsers);
