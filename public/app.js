// =======================
// ❤️ SUOSIKIT – BACKEND + FRONTEND
// =======================

// Päivitä suosikkien määrä headeriin
async function updateFavCounter() {
  const res = await fetch("/api/favorites");
  const favorites = await res.json();

  const counter = document.getElementById("fav-count");

  if (favorites.length > 0) {
    counter.style.display = "flex";
    counter.textContent = favorites.length;
  } else {
    counter.style.display = "none";
  }

  counter.classList.add("bump");
  setTimeout(() => counter.classList.remove("bump"), 300);
}

// Merkitse sydämet aktiivisiksi SQL datan perusteella
async function loadFavoriteHearts() {
  const res = await fetch("/api/favorites");
  const favorites = await res.json(); // tulee täydet pizza-objektit

  favorites.forEach(fav => {
    const icon = document.getElementById("fav-" + fav.id);
    if (icon) {
      icon.classList.add("active");
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    }
  });

  updateFavCounter();
}

// Käyttäjä klikkaa sydäntä
async function toggleFavorite(id) {
  const icon = document.getElementById("fav-" + id);
  if (!icon) return;

  const isActive = icon.classList.toggle("active");

  if (isActive) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");

    await fetch("/api/favorites/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizza_id: id })
    });

  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");

    await fetch("/api/favorites/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizza_id: id })
    });
  }

  updateFavCounter();
}



// =======================
//  LATAA PIZZA-KORTIT
// =======================

async function loadPizzas() {
  try {
    const res = await fetch("/api/menu");
    const pizzas = await res.json();

    const container = document.getElementById("menu-grid");
    container.innerHTML = "";

    pizzas.forEach((pizza) => {
      const card = document.createElement("div");
      card.classList.add("pizza-card");

      card.innerHTML = `
        <div class="favorite-icon" onclick="toggleFavorite(${pizza.id})">
          <i id="fav-${pizza.id}" class="fa-regular fa-heart fav-heart"></i>
        </div>

        <img src="kuvat/${pizza.image}" 
             class="pizza-img"
             data-id="${pizza.id}"
             alt="${pizza.name}">

        <div class="pizza-info">
          <h3 class="pizza-name">${pizza.name}</h3>
          <p class="pizza-desc">${pizza.description}</p>

          <button class="customize-btn" data-id="${pizza.id}">
            Muokkaa täytteitä
          </button>

          <div class="price-row">
            <p class="pizza-price">€${Number(pizza.base_price).toFixed(2)}</p>

            <button class="add-btn" data-id="${pizza.id}">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    loadFavoriteHearts();

  } catch (err) {
    console.error("VIRHE: pizzalistan lataus epäonnistui", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPizzas);



// =======================
// ❤️ SUOSIKKI POPUP
// =======================

document.querySelector(".fav-btn").addEventListener("click", (e) => {
  e.preventDefault();
  openFavorites();
});

document.getElementById("close-fav").addEventListener("click", () => {
  document.getElementById("fav-panel").classList.remove("active");
});

async function openFavorites() {
  const favPanel = document.getElementById("fav-panel");
  const favList = document.getElementById("fav-list");

  favList.innerHTML = "";

  const favRes = await fetch("/api/favorites");
  const favorites = await favRes.json(); // tulee lista pizza-objekteja

  if (favorites.length === 0) {
    favList.innerHTML = "<p>No favorites added yet ❤️</p>";
    favPanel.classList.add("active");
    return;
  }

  favorites.forEach((pizza) => {
    const li = document.createElement("li");
    li.classList.add("fav-item");

    li.innerHTML = `
      <img src="kuvat/${pizza.image}">
      <div>
        <p><strong>${pizza.name}</strong></p>
        <p>€${Number(pizza.base_price).toFixed(2)}</p>
      </div>

      <i class="fa-solid fa-trash remove-fav" data-id="${pizza.id}"></i>
    `;

    favList.appendChild(li);
  });

  favPanel.classList.add("active");
}

// ⭐ KORJAUS: Poista SQL:stä JA päivitys pizzakorttiin
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("remove-fav")) {
    const id = Number(e.target.dataset.id);

    await fetch("/api/favorites/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pizza_id: id })
    });

    // 🔥 PÄIVITÄ SYDÄN PIZZAKORTISSA
    const heart = document.getElementById("fav-" + id);
    if (heart) {
      heart.classList.remove("active", "fa-solid");
      heart.classList.add("fa-regular");
    }

    updateFavCounter();
    openFavorites();
  }
});



// =======================
// 🧀🍅 PIZZA MODAALI
// =======================

const pizzaModal = document.getElementById("pizza-modal");
const closePizzaModal = document.getElementById("close-pizza-modal");

let currentPizza = null;
let pizzaOptions = null;

// Klikkaus avaa modaalin
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("pizza-img") || e.target.classList.contains("customize-btn")) {

    const id = e.target.dataset.id;

    try {
      const res = await fetch(`/api/menu/${id}`);
      const data = await res.json();

      setupCurrentPizza(data);
      openPizzaModal();
    } catch (err) {
      console.error("VIRHE: pizzan nouto epäonnistui", err);
    }
  }
});

function setupCurrentPizza(data) {
  pizzaOptions = data.options;
  const defaults = data.defaults;

  currentPizza = {
    id: data.id,
    name: data.name,
    description: data.description,
    base_price: Number(data.base_price),
    image: data.image,

    base: defaults.base[0],
    sauce: defaults.sauce[0],

    cheese: pizzaOptions.cheese.map(opt => {
      const def = defaults.cheese.find(d => d.id === opt.id);
      return { ...opt, qty: def ? 1 : 0 };
    }),

    toppings: pizzaOptions.topping.map(opt => {
      const def = defaults.topping.find(d => d.id === opt.id);
      return { ...opt, qty: def ? 1 : 0 };
    })
  };
}

function openPizzaModal() {
  document.getElementById("modal-pizza-img").src = "kuvat/" + currentPizza.image;
  document.getElementById("modal-pizza-name").textContent = currentPizza.name;
  document.getElementById("modal-pizza-desc").textContent = currentPizza.description;

  renderToppings();
  updatePrice();

  pizzaModal.classList.remove("hidden");
}

closePizzaModal.addEventListener("click", () => pizzaModal.classList.add("hidden"));

function renderToppings() {
  const cheeseList = document.getElementById("modal-cheese");
  const topList = document.getElementById("modal-toppings");

  cheeseList.innerHTML = "";
  topList.innerHTML = "";

  currentPizza.cheese.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.name} ${t.price > 0 ? "(+€" + t.price + ")" : ""}</span>
      <span>
        <button class="minus-t" data-type="cheese" data-i="${i}">−</button>
        x${t.qty}
        <button class="plus-t" data-type="cheese" data-i="${i}">+</button>
      </span>
    `;
    cheeseList.appendChild(li);
  });

  currentPizza.toppings.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.name} ${t.price > 0 ? "(+€" + t.price + ")" : ""}</span>
      <span>
        <button class="minus-t" data-type="topping" data-i="${i}">−</button>
        x${t.qty}
        <button class="plus-t" data-type="topping" data-i="${i}">+</button>
      </span>
    `;
    topList.appendChild(li);
  });
}

function updatePrice() {
  let total = Number(currentPizza.base_price);
  total += currentPizza.cheese.reduce((sum, t) => sum + t.qty * t.price, 0);
  total += currentPizza.toppings.reduce((sum, t) => sum + t.qty * t.price, 0);
  document.getElementById("modal-price").textContent = total.toFixed(2);
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("plus-t") || e.target.classList.contains("minus-t")) {
    const arr = e.target.dataset.type === "cheese"
      ? currentPizza.cheese
      : currentPizza.toppings;

    const idx = Number(e.target.dataset.i);

    if (e.target.classList.contains("plus-t")) arr[idx].qty++;
    else arr[idx].qty = Math.max(0, arr[idx].qty - 1);

    renderToppings();
    updatePrice();
  }
});

document.getElementById("modal-add-to-cart").addEventListener("click", () => {
  if (!currentPizza) return;

  const item = buildCurrentPizzaCartItem();

  if (window.addCustomPizzaToCart) {
    window.addCustomPizzaToCart(item);
  }

  pizzaModal.classList.add("hidden");
});

function buildCurrentPizzaCartItem() {
  const selectedCheese = currentPizza.cheese.filter(t => t.qty > 0);
  const selectedToppings = currentPizza.toppings.filter(t => t.qty > 0);

  let total = currentPizza.base_price;
  total += selectedCheese.reduce((sum, t) => sum + t.qty * t.price, 0);
  total += selectedToppings.reduce((sum, t) => sum + t.qty * t.price, 0);

  return {
    id: "custom-" + currentPizza.id + "-" + Math.random(),
    type: "pizza",
    name: currentPizza.name,
    price: Number(total.toFixed(2)),
    quantity: 1,
    img: "kuvat/" + currentPizza.image,

    cheese: selectedCheese,
    toppings: selectedToppings
  };
}



// =======================
// MOBILE MENU
// =======================

const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("menu-overlay");
const closeMenu = document.getElementById("close-mobile-menu");
const hamburger = document.querySelector(".fa-bars");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
});

closeMenu.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});
