import { API_BASE_URL } from "./constants.mjs";
import { fetchData } from "./fetchData.mjs";

// call the API
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const games = await fetchData(API_BASE_URL);
    for (var i = 0; i < games.length; i++) {
      console.log(games[i]);
      renderGames(games[i]);
    }
  } catch (error) {
    alert(error.message);
  }

  function renderGames(game) {
    //create the anchor
    const productContentAnchor = document.createElement("a");
    productContentAnchor.href = `../product/index.html?id=${game.id}`;

    //create the main div
    const productContentDiv = document.createElement("div");
    productContentDiv.className = "product-content";

    //create the background div
    const backgroundDiv = document.createElement("div");
    backgroundDiv.className = "background";

    //create the img-container div
    const imgContainerDiv = document.createElement("div");
    imgContainerDiv.className = "img-container";

    //create the img element
    const imgElement = document.createElement("img");
    imgElement.src = game.image;
    imgElement.alt = game.description;
    imgElement.className = "cover";

    //Append the img element to the img-container div
    imgContainerDiv.appendChild(imgElement);

    //create the h2 element
    const h2Element = document.createElement("h2");
    h2Element.textContent = game.title;

    //create the p element
    const pElement = document.createElement("p");
    pElement.textContent = game.genre;

    //create the h3 element
    const h3Element = document.createElement("h3");
    h3Element.textContent = game.price;

    //append the background div to the main product-content div
    backgroundDiv.appendChild(imgContainerDiv);
    backgroundDiv.appendChild(h2Element);
    backgroundDiv.appendChild(pElement);
    backgroundDiv.appendChild(h3Element);

    //append the background div to the main product-content-div
    productContentDiv.appendChild(backgroundDiv);

    // append the anchor tag to the product to the product-content div
    productContentAnchor.appendChild(productContentDiv);

    const section = document.getElementById("product-list");
    section.appendChild(productContentAnchor);
  }
});
