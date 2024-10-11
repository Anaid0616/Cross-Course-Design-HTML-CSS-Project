// cart.mjs
export function addToCart(product, cartItems) {
  // Check if the item already exists in the cart
  const existingItemIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (existingItemIndex !== -1) {
    // If the item exists, increase the quantity
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // If the item does not exist, add it with quantity 1
    product.quantity = 1;
    cartItems.push(product);
  }

  // Save updated cart to local storage
  localStorage.setItem("cart", JSON.stringify(cartItems));

  // Update cart counter
  updateCartCounter();

  // Optional: Display a confirmation message
  alert("Product added to cart!");
}

export function updateCartCounter() {
  const cartCountElement = document.getElementById("cart-count");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Calculate the total quantity of items in the cart
  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Update the cart count element with the total quantity
  cartCountElement.textContent = totalQuantity;
}
