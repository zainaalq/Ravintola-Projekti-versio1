"use strict";

// =======================
//  OSTOSKORI DATA
// =======================
let cart = [];

const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");

if (cartCount) {
  cartCount.style.display = "none";
}

// Yleinen apufunktio: lisää/merge tuote koriin
function addItemToCart(item) {
  const existing = cart.find((p) => p.id === item.id);

  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    item.quantity = item.quantity || 1;
    cart.push(item);
  }

  updateCartUI();
}

// =======================
//  LISÄÄ PIZZA KORTISTA (NOPEA LISÄYS)
// =======================
document.addEventListener("click", (e) => {
  const button = e.target.closest(".add-btn");
  if (!button) return;

  const card = button.closest(".pizza-card");
  if (!card) return; // ei pizza

  const name = card.querySelector(".pizza-name").textContent;
  const price = parseFloat(
    card.querySelector(".pizza-price").textContent.replace("€", "")
  );
  const imgSrc = card.querySelector(".pizza-img").src;

  // yksinkertainen pizza, ilman täyteinfoa
  const uniqueId = `pizza-${name}`;

  addItemToCart({
    id: uniqueId,
    type: "pizza",
    name,
    base: null,
    sauce: null,
    cheese: [],
    toppings: [],
    price,
    img: imgSrc,
    quantity: 1,
  });
});

// =======================
//  LISÄÄ JUOMA KORTISTA (SIZE SUPPORT)
// =======================
document.addEventListener("click", (e) => {
  const button = e.target.closest(".add-btn");
  if (!button) return;

  const card = button.closest(".drink-card");
  if (!card) return; // ei juoma

  const name = card.querySelector(".drink-name").textContent;
  const imgSrc = card.querySelector(".drink-img").src;

  const selectedRadio = card.querySelector("input[type=radio]:checked");
  const size = selectedRadio.dataset.size;
  const price = parseFloat(selectedRadio.dataset.price);

  const uniqueId = `drink-${name}-${size}`;

  addItemToCart({
    id: uniqueId,
    type: "drink",
    name,
    size,
    price,
    img: imgSrc,
    quantity: 1,
  });
});

// =======================
//  MODAALISTA LISÄTTY PIZZA (KOTIPIZZA-TYYLI)
// =======================
// Tätä kutsutaan app.js:stä: window.addCustomPizzaToCart(item)
window.addCustomPizzaToCart = function (pizzaItem) {
  addItemToCart(pizzaItem);
};

// =======================
//  PÄIVITÄ OSTOSKORI UI
// =======================
function updateCartUI() {
  cartItemsList.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    count += item.quantity;

    const li = document.createElement("li");
    li.classList.add("cart-item");

    // lisätään täyte-info pizzalle
    let configText = "";

    if (item.type === "pizza") {
      const parts = [];

      if (item.base) parts.push(item.base.name);
      if (item.sauce) parts.push(item.sauce.name);

      if (item.cheese && item.cheese.length) {
        parts.push(
          "Juusto: " +
            item.cheese
              .map((t) => `${t.name}${t.qty > 1 ? " x" + t.qty : ""}`)
              .join(", ")
        );
      }

      if (item.toppings && item.toppings.length) {
        parts.push(
          "Täytteet: " +
            item.toppings
              .map((t) => `${t.name}${t.qty > 1 ? " x" + t.qty : ""}`)
              .join(", ")
        );
      }

      configText = parts.join(" | ");
    }

    li.innerHTML = `
      <img src="${item.img}" class="cart-img">
      <div class="cart-item-info">
          <span class="cart-name">
            ${item.name} ${item.size ? "(" + item.size + ")" : ""} x${
      item.quantity
    }
          </span>
          ${
            configText
              ? `<div class="cart-config">${configText}</div>`
              : ""
          }
          <span class="cart-price">€${lineTotal.toFixed(2)}</span>
      </div>
      <div class="quantity-controls">
          <button class="minus">−</button>
          <button class="plus">+</button>
      </div>
    `;

    // Lisää määrä
    li.querySelector(".plus").addEventListener("click", () => {
      item.quantity++;
      updateCartUI();
    });

    // Vähennä määrä
    li.querySelector(".minus").addEventListener("click", () => {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter((p) => p.id !== item.id);
      }
      updateCartUI();
    });

    cartItemsList.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;

  cartCount.style.display = count > 0 ? "inline-flex" : "none";

  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 200);
}

// =======================
//  OSTOSKORIN AVAUS / SULKU
// =======================
if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartPanel.classList.add("open");
  });
}

if (closeCart) {
  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
  });
}

// =======================
//  TYHJENNÄ KOKO OSTOSKORI
// =======================
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
  });
}
