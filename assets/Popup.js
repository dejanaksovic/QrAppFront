export class Popup {
  constructor(message, iconPath) {
    this.message = message;
    this.iconPath = iconPath;
    // Form main container
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("enable-sticky");
    // Sticky container
    const stickyContainer = document.createElement("div");
    stickyContainer.classList.add("popup-container", "bg-accent");
    // Svg for popu
    const svg = document.createElement("img");
    svg.src = iconPath;
    // Message paragraph
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    // button div
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    // Make buttons
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "POTVRDI";
    const rejectButton = document.createElement("button");
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

}