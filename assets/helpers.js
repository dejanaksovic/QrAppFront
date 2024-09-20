export const getUserIdFromUrl = (url) => {
  const searchParams = new URLSearchParams(url);
  const id = searchParams.get("id");
  return id;
}

export const URL = "http://localhost:3000";

export const articleNames = new Set(["mala-kafa", "velika-kafa", "sok"]);
