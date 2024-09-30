export const handleError = (obj) => {
  const { res, data, flashMessage, pageShifter, successMessage, notFoundName } = obj;
  if(!res || !data || !flashMessage || !pageShifter) 
    throw Error("Svi argumenti nisu dati");
  if(res.ok) {
    return flashMessage.showMessage(successMessage, "success");
  }
  if(res.status === 404) {
    return pageShifter.showPageOnly("404");
  }
  if(res.status === 500) {
    return pageShifter.showPageOnly(500);
  }
  if(res.status === 403) {
    return flashMessage.showMessage("Pogresna sifra", "error");
  }

  const { message } = data;

  return flashMessage.showMessage(message, "error");
}