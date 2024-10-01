import { Popup } from "../../assets/Popup.js";
const popup=new Popup();
popup.showPopup("Da li hocete da prihvatite novog korisnika?","../../svgs/del-user.svg",()=>{
  console.log("Radi");
})