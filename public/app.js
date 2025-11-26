// LATAA PIZZAT BACKENDISTA

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
  } catch (err) {
    console.error("VIRHE:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPizzas);



const pizzaModal = document.getElementById("pizza-modal");
const closePizzaModal = document.getElementById("close-pizza-modal");

let currentPizza = null;


document.addEventListener("click", async (e) => {
  
  if (e.target.classList.contains("pizza-img") ||
      e.target.classList.contains("customize-btn")) {

    const id = e.target.dataset.id;
    const res = await fetch(`/api/menu/${id}`);
    const pizza = await res.json();

    currentPizza = pizza;
    openPizzaModal();
  }
});

function openPizzaModal() {
  document.getElementById("modal-pizza-img").src = "kuvat/" + currentPizza.image;
  document.getElementById("modal-pizza-name").textContent = currentPizza.name;
  document.getElementById("modal-pizza-desc").textContent = currentPizza.description;

  renderToppings();
  updatePrice();

  pizzaModal.classList.remove("hidden");
}

if (closePizzaModal) {
  closePizzaModal.addEventListener("click", () =>
    pizzaModal.classList.add("hidden")
  );
}


//  näytä täytteet

function renderToppings() {
  const baseList = document.getElementById("modal-base");
  const sauceList = document.getElementById("modal-sauce");
  const cheeseList = document.getElementById("modal-cheese");
  const topList = document.getElementById("modal-toppings");

  baseList.innerHTML = "";
  sauceList.innerHTML = "";
  cheeseList.innerHTML = "";
  topList.innerHTML = "";

  currentPizza.toppings.forEach((t, i) => {

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.name} ${t.price > 0 ? "(+€" + t.price + ")" : ""}</span>
      <span>
        <button class="minus-t" data-i="${i}">−</button>
        x${t.qty ?? 1}
        <button class="plus-t" data-i="${i}">+</button>
      </span>
    `;

    if (!currentPizza.toppings[i].qty) currentPizza.toppings[i].qty = 1;

    if (t.category === "base") baseList.appendChild(li);
    else if (t.category === "sauce") sauceList.appendChild(li);
    else if (t.category === "cheese") cheeseList.appendChild(li);
    else topList.appendChild(li);
  });
}


// Hinnan laskeminen

function updatePrice() {
  let base = Number(currentPizza.base_price);
  let extra = currentPizza.toppings.reduce(
    (sum, t) => sum + (t.qty ?? 1) * Number(t.price),
    0
  );

  document.getElementById("modal-price").textContent = (base + extra).toFixed(2);
}


// + / - napit

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("plus-t")) {
    const i = e.target.dataset.i;
    currentPizza.toppings[i].qty++;
    renderToppings();
    updatePrice();
  }

  if (e.target.classList.contains("minus-t")) {
    const i = e.target.dataset.i;
    currentPizza.toppings[i].qty--;
    if (currentPizza.toppings[i].qty < 1) currentPizza.toppings[i].qty = 1;
    renderToppings();
    updatePrice();
  }
});
