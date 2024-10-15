export const getUserIdFromUrl = (url) => {
  const searchParams = new URLSearchParams(url);
  const id = searchParams.get("id");
  return id;
}

export const getBasePath = () => {
  const path = window.location.href;
  const pathBySlash = path.split("/");
  const basePath = pathBySlash.slice(0, 3).join("/");
    return `${basePath}`;
}

export const getTransactionTime = (date) => {
  return `${date.getDay()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`
}

export const URL = "http://localhost:3000";
