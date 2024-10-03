import { showLoader, hideLoader } from "./loader.mjs";
import { fetchData } from "./fetchData.mjs";
import { API_BASE_URL } from "./constants.mjs";

// index html
const productListIndex = document.querySelector(".product-list-index");
const filterSelect = document.getElementById("filterSelect");

// Filter
async function applyFilter() {
  const selectedGenre = document.getElementById("filterSelect").value;

  const games = await fetchData(API_BASE_URL);

  productListIndex.innerHTML = "";

  // Sort games by genre
  for (let i = 0; i < games.length; i++) {
    const product = games[i];
    const productGenre = product.genre.toLowerCase();

    if (selectedGenre === "all" || productGenre === selectedGenre) {
      displayGame(product);
    }
  }
}

filterSelect.addEventListener("change", applyFilter);

applyFilter();

// display games
function displayGame(product) {
  const productDiv = document.createElement("div");

  const backgroundDiv = document.createElement("div");
  productDiv.classList.add("background");

  const anchor = document.createElement("a");
  anchor.href = `../product/index.html?id=${product.id}`;

  const imgContainer = document.createElement("div");
  imgContainer.classList.add("img-container");

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.title;
  image.classList.add("cover");

  const title = document.createElement("h2");
  const genre = document.createElement("p");
  const price = document.createElement("h3");

  genre.textContent = product.genre;
  title.textContent = product.title;
  price.textContent = product.price;

  imgContainer.appendChild(image);
  backgroundDiv.appendChild(imgContainer);
  anchor.appendChild(imgContainer);
  backgroundDiv.appendChild(anchor);
  productDiv.appendChild(backgroundDiv);
  productDiv.appendChild(title);
  productDiv.appendChild(genre);
  productDiv.appendChild(price);

  productListIndex.appendChild(productDiv);
}
