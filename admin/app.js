import { FlashMessage } from "../assets/Flash.js";
import { URL } from "../assets/helpers.js";
import { PageShifter } from "../assets/Pageshifter.js";
// Page names
const pageNames = ["login-page", "view-page", "500", "create-page", "edit-page"];
// ELEMENTS
const usersContainer = document.getElementById("user-container")
const passwordInput = document.getElementById("password");
const savePassword = document.getElementById("remember-password");

const jumpToAdd = document.getElementById("add-user-button");
const addButton = document.getElementById("create-confirm-button");

const changeNameInput = document.getElementById("name-change");
const changeConfirmButton = document.getElementById("change-confirm");
const changeResetButton = document.getElementById("change-reset");

const addNameInput = document.getElementById("name-add");
const addBalanceInput = document.getElementById("balance-add");

const loginButton = document.getElementById("login-button");

// Globals
let password = localStorage.getItem("password");
let changeId = "";

// Flash
const flashMessage = new FlashMessage("flash");
// Setup page shifter
const pageShifter = new PageShifter(pageNames, "login-page");


// Populate users;
const populateUsers = (users) => {
  // HARD RESET
  usersContainer.textContent = "";
  users.forEach(user => {
    // Create element for user
    const nameContainer = document.createElement("p");
    nameContainer.textContent = user.Name;
    usersContainer.appendChild(nameContainer);
    // Edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button", "bg-warning", "default-box-shadow");
    editButton.addEventListener("click", e => {
      changeId = user._id;
      pageShifter.showPageOnly("edit-page");
      console.log(changeId);
    });
    const editImage = document.createElement("img");
    editImage.src = "../svgs/screwdriver-tools-construction-flathead-repair-tool-equipment-svgrepo-com.svg";
    editButton.appendChild(editImage);
    usersContainer.appendChild(editButton);
    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("remove-button", "bg-error", "default-box-shadow");
    deleteButton.addEventListener("click", async e => {
      let res;
      let data;
      try {
        res = await fetch(`${URL}/users/${user._id}`, {
          method: "DELETE",
          headers: {
          "Content-Type" : "application/json",
          "authorization": `${password}`,
        },
      })
      data = await res.json();
    }
    catch(err) {
      pageShifter.showPageOnly("500");
    }
    const { message } = data;
    requestUsersHandler();
    pageShifter.showPageOnly("view-page");
    if(message) {
      return flashMessage.showMessage(message, "error");
    }
    if(data.user) {
      return flashMessage.showMessage("Uspesno obrisan korisnik", "success");
    }
      });
      const deleteImage = document.createElement("img");
      deleteImage.src = "../svgs/user-delete-svgrepo-com.svg";
      deleteButton.appendChild(deleteImage);
      usersContainer.appendChild(deleteButton);
      console.log(usersContainer);
    })
}

// HANDLERS
// user request
const requestUsersHandler = async (e) => {
  let res;
  let data;
  if(!password) {
    password = passwordInput.value;
    if(savePassword.checked) {
      localStorage.setItem("password", password);
    }
  }
  try {
    res = await fetch(`${URL}/users`, {
      headers: {
        "content-type": "application/json",
        "authorization":`${password}`,
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

  if(res.status === 401 || res.status === 403) {
    flashMessage.showMessage("Pogresna sifra", "error");
    pageShifter.showPageOnly("login-page");
    // full reset password
    password = "";
    localStorage.clearItem("password");
    return;
  }

  if(message) {
    return flashMessage.showMessage(message, "error");
  }

  populateUsers(users);
  pageShifter.showPageOnly("view-page");
  
}

// Add
const handleAdd = async (e) => {
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "authorization": `${password}`,
      },
      body: JSON.stringify({
        name: addNameInput.value,
        coins: addBalanceInput.value,
      }),
    });
    data = await res.json();
  }
  catch(err) {
    pageShifter.showPageOnly("500");
  }

  const { message, user } = data;

  await requestUsersHandler();
  pageShifter.showPageOnly("view-page");
  // Reset add form
  addNameInput.value = "";
  addBalanceInput.value = "";
  
  if(res.ok) {
    return flashMessage.showMessage("Uspesno kreiranje korisnika", "success");
  }

  if(message) {
    return flashMessage.showMessage(message, "error");
  }
}

// change
const resetChangeHandler = (e) => {
  changeNameInput.value = "";
  changeBalanceInput = "";
}
const requestChangeHandler = async (e) => {
  const name = changeNameInput.value;
  console.log(changeId);
  console.log(name);
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users/${changeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "authorization":`${password}`,
      },
      body: JSON.stringify({
        name,
      }),
    })
    data = await res.json();
    console.log(data);
  }
  catch(err) {
    pageShifter.showPageOnly("500");
    return;
  }

  const { user, message } = data;

  if(res.status === 500) {
    pageShifter.showPageOnly("500");
    return;
  }

  await requestUsersHandler();
  pageShifter.showPageOnly("view-page");
  // Reset change inputs
  changeNameInput.value = "";

  if(message) {
    return flashMessage.showMessage(message, "error");
  }

  return flashMessage.showMessage("Uspesno menjanje podataka korisnika", "success");
}


loginButton.addEventListener("click", requestUsersHandler);
changeResetButton.addEventListener("click", resetChangeHandler);
changeConfirmButton.addEventListener("click", requestChangeHandler);
jumpToAdd.addEventListener("click", e => {
  pageShifter.showPageOnly("create-page");
})
addButton.addEventListener("click", handleAdd);

// Check for password and show view page if it's saved
if(password) {
  requestUsersHandler();
  pageShifter.showPageOnly("view-page");
}