export const getUserIdFromUrl = (url) => {
  console.log(url);
  const searchParams = new URLSearchParams(url);
  console.log(searchParams);
  const id = searchParams.get("id");
  console.log(id);
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