import { addToCart, updateCartCounter } from "./cart.mjs";
import { API_BASE_URL } from "./constants.mjs";
import { fetchData } from "./fetchData.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
      console.error("No product ID found in URL");
      return;
    }

    const product = await fetchData(`${API_BASE_URL}/${productId}`);

    console.log(product);

    const productTitle = document.querySelector(".product-content h2");
    const productGenre = document.querySelector(".product-content .genre");
    const productPrice = document.querySelector(".product-content h3");
    const productDescription = document.querySelector(
      ".product-content .description"
    );
    const productImage = document.querySelector(".product-img");
    const addToCartButton = document.querySelector(".cta-button");

    productTitle.textContent = product.title;
    productGenre.textContent = product.genre;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
    productImage.src = product.image;
    productImage.alt = product.title;

    addToCartButton.textContent = "Add to cart";

    addToCartButton.href = `javascript:void(0);`;

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Add event listener to "Add to cart" button
    addToCartButton.addEventListener("click", function () {
      addToCart(product, cartItems); // Add the current product to the cart
    });

    // Update cart counter
    updateCartCounter();
  } catch (error) {
    console.error("Error fetching product:", error);
  }
});

window.addEventListener("storage", () => {
  renderLayout(); // Re-render the checkout page whenever local storage changes
});
