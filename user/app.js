import { getUserIdFromUrl } from "../assets/helpers";

const id = getUserIdFromUrl(window.location.href.search);

if(!)