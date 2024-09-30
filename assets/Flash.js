export class FlashMessage {
  container;
  messageDelay;

  constructor(messageDelay = 4000) {
    this.container = document.createElement("div");
    // Default stylings;
    this.container.classList.add("flash-container");
    document.body.prepend(this.container);
    this.messageDelay = messageDelay;
  }

  showMessage(message, severity) {
    // Create message
    const messageContainer = document.createElement("p");
    messageContainer.classList.add("flash-message", "remove-flash");
    messageContainer.textContent = message;
    this.container.appendChild(messageContainer);
    messageContainer.classList.remove("remove-flash");
    // Add message
    switch(severity) {
      case "error": {
        messageContainer.classList.add("bg-error");
        break;
      }
      case "success": {
        messageContainer.classList.add("bg-success");
        break;
      }
      case "warning": {
        messageContainer.classList.add("bg-warning");
        break;
      }
      default: {
        throw Error("Severity not valid");
      }
    }

    messageContainer.classList.remove("remove-flash");

    setTimeout(() => {
      // Hide the message
      messageContainer.classList.add("remove-flash");
      // Remove the message after animation timing
      setTimeout(() => {
      this.container.removeChild(messageContainer);
      });
    }, this.messageDelay);
  }
}