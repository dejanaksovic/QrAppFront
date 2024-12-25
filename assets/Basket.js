export class Basket {
  basket = [];
  #domElems = [];
  price = 0;
  constructor(container, updateFunc) {
    this.container = container;
    this.updateFunc = updateFunc;
  }

  #createAndAppend(article) {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("basket-item");
    const nameElement = document.createElement("p");
    nameElement.textContent = article.Name;
    const plus = document.createElement("span");
    const value = document.createElement("span");
    const minus = document.createElement("span");

    plus.textContent = "+";
    value.textContent = 1;
    minus.textContent = "-";

    plus.addEventListener("click", (e) => {
      this.addArticle(article);
    });
    minus.addEventListener("click", (e) => {
      this.decrementArticle(article);
    });

    const quantityElement = document.createElement("p");
    quantityElement.append(minus, value, plus);
    const priceElement = document.createElement("p");
    priceElement.textContent = article.Price;
    itemContainer.append(nameElement, quantityElement, priceElement);

    // DOM
    this.container.appendChild(itemContainer);
    this.#domElems.push({
      id: article._id,
      elem: itemContainer,
    });

    // Logic
    // Cech if it exists
    const existsArticle = this.basket.find((e) => e.articleId === article._id);
    if (existsArticle) {
      return (existsArticle.quantity += 1);
    }
    this.basket.push({
      articleId: article._id,
      quantity: 1,
    });
  }

  #incrementArticle(article) {
    const articleElement = this.#domElems.find(
      (e) => e.id === article._id
    ).elem;
    const quantityElement = articleElement.querySelector(
      "p:nth-child(2) span:nth-child(2)"
    );
    const priceElement = articleElement.querySelector("p:nth-child(3)");

    const articleToInc = this.basket.find((e) => e.articleId === article._id);
    articleToInc.quantity += 1;

    const newQuantity = articleToInc.quantity;
    const newPrice = newQuantity * article.Price;

    quantityElement.textContent = newQuantity;
    priceElement.textContent = newPrice;

    // Logic
  }

  decrementArticle(article) {
    const articleElement = this.#domElems.find((e) => e.id === article._id);
    const quantityElement = articleElement.elem.querySelector(
      "p:nth-child(2) span:nth-child(2)"
    );
    const priceElement = articleElement.elem.querySelector("p:nth-child(3)");

    const newQuantity = Number(quantityElement.textContent) - 1;
    const newPrice = newQuantity * article.Price;

    quantityElement.textContent = newQuantity;
    priceElement.textContent = newPrice;

    // Logic
    const articleLogic = this.basket.find((e) => e.articleId === article._id);
    articleLogic.quantity -= 1;
    if (newQuantity === 0) {
      this.basket.splice(this.basket.indexOf(articleLogic), 1);
      articleElement.elem.remove();
      // Delete it from dom
      const index = this.#domElems.indexOf(articleElement);
      this.#domElems.splice(index, 1);
    }
    console.log(this.basket);
    this.price -= article.Price;
    this.updateFunc(this);
  }

  addArticle(article) {
    this.price += article.Price;
    this.updateFunc(this);
    if (this.basket.find((e) => e.articleId === article._id)?.quantity > 0) {
      return this.#incrementArticle(article);
    }
    this.#createAndAppend(article);
  }

  reset() {
    this.basket = [];
    for (let item of this.#domElems) {
      item.elem.remove();
    }
    this.#domElems = [];
  }

  get basket() {
    return this.basket;
  }
}
