"use strict";

// 🛒 Ostoskori data
let cart = [];

// 🔹 Hakee kaikki + napit pizzakorteista
const addButtons = document.querySelectorAll(".add-btn");

// 🔹 Ostoskori UI elementit
const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");

cartCount.style.display = "none"; // piilota numeromerkki alkuun


// ➕ Lisää tuote ostoskoriin
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".pizza-card");

    const name = card.querySelector(".pizza-name").textContent;
    const price = parseFloat(card.querySelector(".pizza-price").textContent.replace("€", ""));
    const imgSrc = card.querySelector(".pizza-img").src; // ✅ lisää kuva

    // tarkistetaan onko tuote jo ostoskorissa
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ name, price, quantity: 1, img: imgSrc });
    }

    updateCartUI();
  });
});


// 🔄 Päivitä ostoskori UI
function updateCartUI() {
  cartItemsList.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    const li = document.createElement("li");
    li.classList.add("cart-item");

    li.innerHTML = `
      <img src="${item.img}" class="cart-img">

      <div class="cart-item-info">
          <span class="cart-name">${item.name} (${item.quantity})</span>
          <span class="cart-price">€${(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <div class="quantity-controls">
          <button class="minus">−</button>
          <button class="plus">+</button>
      </div>
    `;

    // ➕ Lisää määrä
    li.querySelector(".plus").addEventListener("click", () => {
      item.quantity++;
      updateCartUI();
    });

    // ➖ Vähennä määrä
    li.querySelector(".minus").addEventListener("click", () => {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(p => p.name !== item.name);
      }
      updateCartUI();
    });

    cartItemsList.appendChild(li);
  });

  // Päivitä hinta ja määrä
  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;

  // bump animaatio hintaan
  cartTotal.classList.add("bump");
  setTimeout(() => cartTotal.classList.remove("bump"), 200);

  // bump animaatio määrään
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 200);

  // Näytä tai piilota lukumäärä
  cartCount.style.display = count > 0 ? "inline-flex" : "none";
}


// 🛍️ Avaa ostoskori paneeli
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartPanel.classList.add("open");
});

// ❌ Sulje ostoskori paneeli
closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

// 🧹 TYHJENNÄ KOKO OSTOSKORI (ROSLAKORI)
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = []; // tyhjennä taulukko
    updateCartUI(); // päivitä näkymä
  });
}

