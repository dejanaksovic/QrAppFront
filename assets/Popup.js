export class Popup {
  constructor() {
    // Form main container
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("enable-sticky", "hidden");
    this.mainContainer = mainContainer;
    // Sticky container
    const stickyContainer = document.createElement("div");
    stickyContainer.classList.add("popup-container", "bg-accent");
    // Svg for popu
    const svg = document.createElement("img");
    this.svgElement = svg;
    // Message paragraph
    const messageElement = document.createElement("p");
    this.messageElement = messageElement;
    // button div
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    // Make buttons
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "POTVRDI";
    this.confirmButton = confirmButton;
    const rejectButton = document.createElement("button");
    this.rejectButton = rejectButton;
    rejectButton.textContent = "ODUSTANI";
    // Place into containers
    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(rejectButton);
    stickyContainer.appendChild(svg);
    stickyContainer.appendChild(messageElement);
    stickyContainer.appendChild(buttonsContainer);
    mainContainer.appendChild(stickyContainer);

    // Append to body
    document.body.prepend(mainContainer);
  }

  showPopup(message, path, handler) {
    this.confirmButton.addEventListener("click", (e) => {
      handler(e);
      this.mainContainer.classList.add("hidden");
    }, {once: true});
    this.messageElement.textContent = message;
    this.svgElement.src = path;
    this.rejectButton.addEventListener("click", () => {
      this.mainContainer.classList.add("hidden");
    }, {once: true});
    this.mainContainer.classList.remove("hidden");
  } 
}