export const getUserIdFromUrl = (url) => {
  const searchParams = new URLSearchParams(url);
  const id = searchParams.get("id");
  return id;
}

export const URL = "http://localhost:3000";

export const articleNames = new Set([{
  name: "mala-kafa",
  price: 1,
  buyPrice: 15,
},
{
  name: "sok",
  price: 2,
  buyPrice: 25,
},
{
  name: "velika-kafa",
  price: 3,
  buyPrice: 30,
}]);
