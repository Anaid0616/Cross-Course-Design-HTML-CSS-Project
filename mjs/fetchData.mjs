import { hideLoader, showLoader } from "./loader.mjs";

export async function fetchData(url) {
  try {
    showLoader();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    hideLoader();
  }
}
