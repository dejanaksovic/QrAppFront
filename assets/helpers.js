export const getUserIdFromUrl = (url) => {
  console.log(url);
  const searchParams = new URLSearchParams(url);
  console.log(searchParams);
  const id = searchParams.get("id");
  console.log(id);
  return id;
}