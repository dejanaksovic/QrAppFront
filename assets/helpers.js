export const getUserIdFromUrl = (url) => {
  const searchParams = new URLSearchParams(url);
  const id = searchParams.get("id");
  return id;
}

export const showElement = (element) => {
  if(!(element instanceof HTMLElement))
    throw Error("Must use dom element");
  element.classList.remove("hidden");
}

export const hideElement = (element) => {
  if(!(element instanceof HTMLElement))
    throw Error("Must use dom element");
  element.classList.add("hidden");
}

export const URL = "http://localhost:3000";

export const articleNames = new Set(["mala-kafa", "velika-kafa", "sok"]);