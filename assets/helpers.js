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
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}. ${date.getHours()}:${date.getMinutes()}`
}

export const pickerDate = (date) => {
  if(! (date instanceof Date)) {
    throw Error("date must be a Date");
  }

  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDay()+1).padStart(2, "0")}`;
}

export const getTransactionPrecise = (date) => {
  if(!(date instanceof Date)) {
    throw Error("date must be of type Date")
  }
  
  return `${date.getHours()}:${date.getMinutes()}`
}
