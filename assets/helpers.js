export const getUserIdFromUrl = (url) => {
  const searchParams = new URLSearchParams(url);
  const id = searchParams.get("id");
  return id;
}

export const URL = "http://localhost:3000";
export const getBasePath = () => {
  const path = window.location.href;
  const pathBySlash = path.split("/");
  const basePath = pathBySlash.slice(0, 3).join("/");
    return `${basePath}`;
}

export const getTransactionTime = (date) => {
  return `${date.getDate()}.${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`
}
