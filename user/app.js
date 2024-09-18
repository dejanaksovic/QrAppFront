import { getUserIdFromUrl, hideElement, showElement, URL } from "../assets/helpers";
import { FlashMessage } from "../assets/Flash";

// ELEMENTS

// 404
const notFoundPage = document.getElementById("404");
const userUi = document.querySelector(".main-div");

// Non transac
const nameContainer = document.getElementById("name-container");
const balanceContainer = document.getElementById("balance-container");

// Transac
const articlesContainer = document.getElementById("articles-container");
const coinsContainer = document.getElementById("coins-container");
const timeContainer = document.getElementById("time-container");

// Flash setup
const flashMessage = new FlashMessage("flash");

// Check for non valid id
const id = getUserIdFromUrl(window.location.search);
console.log(id);
if(!id) {
  hideElement(userUi);
  showElement(notFoundPage);
  throw Error("Not found user");
}

// request
const getUser = async () => {
  let res;
  let data;
  try {
    res = await fetch(`${URL}/users/${id}`);
    data = await res.json();
  }
  catch(err) {
    flashMessage.showMessage("Proverite konekciju sa internetom pa probajte opet, ako se problem nastavi kontaktirajte administratora", "error");
  }
  const { user, message } = data;

  if(user) {
    nameContainer.textContent = user?.Name;
    balanceContainer.textContent = user?.Coins;
      
    user?.Transactions?.forEach(({ Articles, Coins, Date: date, Quantities }) => {
      // Setup element for articles
      const articleElement = document.createElement("p");
      articleElement.classList.add("articles-text");
      // Setup inner text
      let innerText = "";
      Articles.forEach((e, i) => {
        innerText+=` ${Quantities[i]} ${e},`
      })
      articleElement.textContent = innerText;
      articleElement.id = "border-bottom";
      articlesContainer.appendChild(articleElement);
      
      // Setup for coins
      const coinsElement = document.createElement("p");
      coinsElement.textContent = Coins;
      coinsElement.id = "border-bottom";
      coinsContainer.appendChild(coinsElement);
      
      // Setup time
      const timeElement = document.createElement("p");
      const dateAsDate = new Date(date);
      timeElement.textContent = `${dateAsDate.getMonth()}/${dateAsDate.getDay()} ${dateAsDate.getHours()}:${dateAsDate.getMinutes()}`;
      timeElement.id = "border-bottom";
      timeContainer.appendChild(timeElement);
    })
    return;
  }
  if(message) {
    // Handle error responses from server
    if(res.status === 404) {
      hideElement(userUi);
      showElement(notFoundPage);
      return;
    }
    return flashMessage.showMessage(message, "error");
  }
}

getUser();