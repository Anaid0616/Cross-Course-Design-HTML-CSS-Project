import { updateCartCounter } from "./cart.mjs";
import { API_BASE_URL } from "./constants.mjs";
import { fetchData } from "./fetchData.mjs";

const cartContainer = document.getElementById("cart-container");
const quantityCounter = document.querySelector(".cart-count");

function addItem(item) {
  // Get the items from local storage
  let cartItems = getCartItems();
  // Add another item
  const index = cartItems.findIndex((cartItem) => cartItem.id === item.id);

  if (index !== -1) {
    cartItems[index].quantity += 1;
  }
  // Save the local storage
  localStorage.setItem("cart", JSON.stringify(cartItems));
  // Call the `renderLayout()` function to render out the new list of items
  renderLayout();
}

function subtractItem(item) {
  // Get the items from local storage
  let cartItems = getCartItems();
  // Remove a single item from the list that matches the same ID
  const index = cartItems.findIndex((cartItem) => cartItem.id === item.id);

  if (index !== -1 && cartItems[index].quantity > 1) {
    cartItems[index].quantity -= 1;
  }
  // Save the local storage
  localStorage.setItem("cart", JSON.stringify(cartItems));
  // Call the `renderLayout()` function to render out the new list of items
  renderLayout();
}

function removeItem(item) {
  // Get the items from local storage
  let cartItems = getCartItems();
  // Remove all the items that match the ID (can use filter array method
  cartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
  // Save local storage
  localStorage.setItem("cart", JSON.stringify(cartItems));
  // Call the `renderLayout()` function to render out the new list of items
  renderLayout();
}

function getCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  return cartItems;
}

function generateCartItemHtml(item) {
  const cartWrapper = document.createElement("div");
  cartWrapper.classList.add("cart-wrapper");

  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("imgWrapper");

  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("genre-title");

  const cartItemElement = document.createElement("div");
  cartItemElement.classList.add("item-info");

  // Image
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("checkout-img-container");
  const itemImage = document.createElement("img");
  itemImage.src = item.image;
  itemImage.alt = item.description;
  itemImage.classList.add("checkout-img");
  imgContainer.appendChild(itemImage);

  // Title
  const titleElement = document.createElement("h3");
  titleElement.textContent = item.title;
  titleElement.classList.add("img-title");

  const genreElement = document.createElement("p");
  genreElement.textContent = item.genre;
  genreElement.classList.add("genre-checkout");

  const priceElement = document.createElement("p");
  priceElement.textContent = `Price: $${item.price.toFixed(2)}`;
  priceElement.classList.add("one-item-price");

  // Quantity Container
  const quantityContainer = document.createElement("div");
  quantityContainer.classList.add("quantity-container");

  // Quantity
  const quantityElement = document.createElement("p");
  quantityElement.textContent = `Quantity: ${item.quantity}`;
  quantityElement.classList.add("quantity-checkout");

  // Quantity Control Buttons
  const subtractButton = document.createElement("button");
  subtractButton.textContent = "-";
  subtractButton.classList.add("quantity-control-subtract");
  subtractButton.addEventListener("click", () => {
    console.log("Subtract button clicked for item:", item); //
    subtractItem(item);
  });

  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.classList.add("quantity-control-add");
  addButton.addEventListener("click", () => {
    console.log("Add button clicked for item:", item); // Debugging
    addItem(item);
  });

  // Remove Button
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("remove-item");
  removeButton.addEventListener("click", () => {
    removeItem(item);
  });

  // Append the controls and quantity element to the quantity container
  quantityContainer.appendChild(subtractButton);
  quantityContainer.appendChild(quantityElement);
  quantityContainer.appendChild(addButton);
  quantityContainer.appendChild(removeButton);

  // Total Price
  const totalElement = document.createElement("p");
  const totalPrice = item.price * item.quantity;
  totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
  totalElement.classList.add("total-price-item");

  // Append elements to cart item container
  cartItemElement.appendChild(titleElement);
  cartItemElement.appendChild(genreElement);
  cartItemElement.appendChild(priceElement);
  cartItemElement.appendChild(quantityContainer);

  quantityContainer.appendChild(quantityElement);
  quantityContainer.appendChild(subtractButton);
  quantityContainer.appendChild(addButton);
  quantityContainer.appendChild(removeButton);
  cartItemElement.appendChild(totalElement);

  imgWrapper.appendChild(imgContainer);
  cartWrapper.appendChild(imgWrapper);
  cartWrapper.appendChild(titleWrapper);
  cartWrapper.appendChild(cartItemElement);
  titleWrapper.appendChild(titleElement);
  titleWrapper.appendChild(genreElement);
  cartContainer.appendChild(cartWrapper);
}

function renderCartItems(cartItems) {
  cartContainer.innerHTML = "";

  const checkoutCartItems = cartItems.reduce((allCartItems, currentItem) => {
    if (Object.hasOwn(allCartItems, currentItem.id)) {
      allCartItems[currentItem.id].quantity += 1;
    } else {
      allCartItems[currentItem.id] = { ...currentItem, quantity: 1 };
    }
    return allCartItems;
  }, {});

  Object.values(checkoutCartItems).forEach((item) => {
    generateCartItemHtml(item);
  });
}

// the full total of all the items.
function updateTotalPrice(cartItems) {
  const totalPriceElement = document.querySelector(".total-price-cart");
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function renderLayout() {
  const cartItems = getCartItems();
  renderCartItems(cartItems);
  // updateTotalPrice(cartItems);
}

function main() {
  renderLayout();
}

main();
