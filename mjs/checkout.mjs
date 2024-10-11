import { updateCartCounter } from "./cart.mjs";
import { API_BASE_URL } from "./constants.mjs";
import { fetchData } from "./fetchData.mjs";

const cartContainer = document.getElementById("cart-container");
const quantityCounter = document.querySelector(".cart-count");

function addItem(item) {
  let cartItems = getCartItems();
  const index = cartItems.findIndex((cartItem) => cartItem.id === item.id);

  if (index !== -1) {
    // Increment the quantity if the item already exists
    cartItems[index].quantity = (cartItems[index].quantity || 0) + 1;
  } else {
    // Add the item if it doesn't exist in the cart
    item.quantity = 1;
    cartItems.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
  renderLayout();
}

function subtractItem(item) {
  let cartItems = getCartItems();
  const index = cartItems.findIndex((cartItem) => cartItem.id === item.id);

  if (index !== -1 && cartItems[index].quantity > 1) {
    // Decrease the quantity if greater than 1
    cartItems[index].quantity -= 1;
  } else if (index !== -1 && cartItems[index].quantity === 1) {
    // Remove the item if the quantity is 1
    cartItems.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
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

  // Combine items with the same ID
  const combinedItems = cartItems.reduce((acc, currentItem) => {
    const existingItem = acc.find((item) => item.id === currentItem.id);
    if (existingItem) {
      // If already exists, update the quantity
      existingItem.quantity += currentItem.quantity;
    } else {
      // Add new item
      acc.push({ ...currentItem });
    }
    return acc;
  }, []);

  return combinedItems;
}

//Generate cart item
function generateCartItemHtml(item) {
  const cartWrapper = document.createElement("div");
  cartWrapper.classList.add("cart-wrapper");
  cartWrapper.dataset.itemId = item.id;

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
  priceElement.textContent = `Price: $${
    item.price ? item.price.toFixed(2) : "0.00"
  }`;
  priceElement.classList.add("one-item-price");

  // Quantity Container
  const quantityContainer = document.createElement("div");
  quantityContainer.classList.add("quantity-container");

  // Quantity
  const quantityElement = document.createElement("p");
  quantityElement.textContent = `${item.quantity ?? 1}`;
  quantityElement.classList.add("quantity-checkout");

  // Quantity Control Buttons
  const subtractButton = document.createElement("button");
  subtractButton.textContent = "-";
  subtractButton.classList.add("quantity-control-subtract");

  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.classList.add("quantity-control-add");

  // Remove Button
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("remove-item");
  removeButton.innerHTML = '<i class="fas fa-trash"></i>';

  // Add event listener for remove button
  removeButton.addEventListener("click", () => {
    removeItem(item);
    updateCartCounter();
  });

  // Append the controls and quantity element to the quantity container
  quantityContainer.appendChild(subtractButton);
  quantityContainer.appendChild(quantityElement);
  quantityContainer.appendChild(addButton);
  quantityContainer.appendChild(removeButton);

  // Total Price
  const totalElement = document.createElement("p");
  const totalPrice = (item.price || 0) * (item.quantity || 1);
  totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
  totalElement.classList.add("total-price-item");

  // Append elements to cart item container
  cartItemElement.appendChild(titleElement);
  cartItemElement.appendChild(genreElement);
  cartItemElement.appendChild(priceElement);
  cartItemElement.appendChild(quantityContainer);
  cartItemElement.appendChild(totalElement);

  imgWrapper.appendChild(imgContainer);
  cartWrapper.appendChild(imgWrapper);
  cartWrapper.appendChild(titleWrapper);
  cartWrapper.appendChild(cartItemElement);
  titleWrapper.appendChild(titleElement);
  titleWrapper.appendChild(genreElement);
  cartContainer.appendChild(cartWrapper);
}

//Render cartitems
function renderCartItems(cartItems) {
  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartContainer.textContent = "Your cart is empty.";
    return;
  }

  // Combine items with the same ID
  const combinedItems = cartItems.reduce((acc, currentItem) => {
    const existingItem = acc.find((item) => item.id === currentItem.id);
    if (existingItem) {
      // If the item already exists, increase its quantity
      existingItem.quantity += currentItem.quantity || 1;
    } else {
      // Otherwise, add the item to the accumulator
      acc.push({ ...currentItem });
    }
    return acc;
  }, []);

  // Generate HTML for each combined item
  combinedItems.forEach((item) => {
    generateCartItemHtml(item);
  });
}

// the full total of all the items.
function updateTotalPrice(cartItems) {
  // Update individual item totals
  cartItems.forEach((item) => {
    const cartItemElement = document.querySelector(
      `.cart-wrapper[data-item-id="${item.id}"]`
    );
    if (cartItemElement) {
      const totalElement = cartItemElement.querySelector(".total-price-item");
      const totalPrice = item.price * (item.quantity || 0);
      totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
  });

  // Calculate the overall order total
  const totalPriceElement = document.querySelector(".total-price-cart");
  const subtotalElement = document.querySelector(".one-item-price strong");
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 0),
    0
  );

  // Update the overall total in both places
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }
  if (subtotalElement) {
    subtotalElement.textContent = `$${totalPrice.toFixed(2)}`;
  }
}

function renderLayout() {
  const cartItems = getCartItems();
  cartContainer.innerHTML = "";
  renderCartItems(cartItems);
  updateTotalPrice(cartItems);
}

function main() {
  renderLayout();
}

main();

// event delegation buttons
cartContainer.addEventListener("click", (event) => {
  const itemId = event.target.closest(".cart-wrapper")?.dataset.itemId;
  if (!itemId) return; // Return early if no item ID found

  const item = getCartItems().find((cartItem) => cartItem.id === itemId);
  if (!item) return; // Return if item not found

  if (event.target.classList.contains("quantity-control-add")) {
    addItem(item);
    updateCartCounter();
  }

  if (event.target.classList.contains("quantity-control-subtract")) {
    subtractItem(item);
    updateCartCounter();
  }

  if (event.target.classList.contains("remove-item")) {
    removeItem(item);
    updateCartCounter();
  }
});

window.addEventListener("storage", () => {
  renderLayout(); // Re-render the checkout page whenever local storage changes
});

// Get the "Complete order" button
const completeOrderButton = document.querySelector(".order-button");

// Add a click event listener to clear the cart
completeOrderButton.addEventListener("click", () => {
  // Clear the cart from local storage
  localStorage.removeItem("cart");

  // Update the cart counter
  updateCartCounter();
});
