import { Popup } from "../assets/Popup.js";

const popup = new Popup();
popup.showPopup("Please work man", "../svgs/del-user.svg", () => {
  console.log("This shit actually fucking works");
})