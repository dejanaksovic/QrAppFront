export class FlashMessage {
  container;

  constructor(containerId, messageDelay = 4000) {
    this.container = document.getElementById(containerId);

    if(!this.container)
      throw Error("Element id wrong or it doesn't exist")

    // Default stylings;
    this.container.classList.add("flash-container", "remove-flash");
    this.container.style.color = "white";
    this.messageDelay = messageDelay;
  }

  showMessage(message, severity) {
    // Reset background
    this.container.classList.remove("bg-error", "bg-warning", "bg-success");
    // Add message
    this.container.textContent = message;
    switch(severity) {
      case "error": {
        this.container.classList.add("bg-error");
        break;
      }
      case "success": {
        this.container.classList.add("bg-success");
        break;
      }
      case "warning": {
        this.container.classList.add("bg-warning");
        break;
      }
      default: {
        throw Error("Severity not valid");
      }
    }

    this.container.classList.remove("remove-flash");

    setTimeout(() => {
      // Hide the message
      this.container.classList.add("remove-flash");
    }, this.messageDelay)
  }
}