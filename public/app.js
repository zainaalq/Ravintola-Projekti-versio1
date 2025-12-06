// LATAA PIZZAT BACKENDISTA (ilman täytteitä – vain kortteihin)
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
    console.error("VIRHE: pizzalistan lataus epäonnistui", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPizzas);

// =======================
//  PIZZA MODAALI
// =======================

const pizzaModal = document.getElementById("pizza-modal");
const closePizzaModal = document.getElementById("close-pizza-modal");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart");

let currentPizza = null;    // valittu pizza + valinnat
let pizzaOptions = null;    // kaikki mahdolliset täytteet SQL:stä

// Kortin kuva / "Muokkaa täytteitä" -> avaa modaalin
document.addEventListener("click", async (e) => {
  if (
    e.target.classList.contains("pizza-img") ||
    e.target.classList.contains("customize-btn")
  ) {
    const id = e.target.dataset.id;

    try {
      const res = await fetch(`/api/menu/${id}`);
      const data = await res.json();

      // data: { id, name, description, base_price, image, defaults{}, options{} }
      setupCurrentPizza(data);
      openPizzaModal();
    } catch (err) {
      console.error("VIRHE: pizzan nouto epäonnistui", err);
    }
  }
});

// Rakennetaan local tilanne (valinnat) backend-datasta
function setupCurrentPizza(data) {
  pizzaOptions = data.options || {
    base: [],
    sauce: [],
    cheese: [],
    topping: [],
  };

  const defaults = data.defaults || {
    base: [],
    sauce: [],
    cheese: [],
    topping: [],
  };

  const baseOptions = pizzaOptions.base || [];
  const sauceOptions = pizzaOptions.sauce || [];

  const defaultBase = (defaults.base && defaults.base[0]) || baseOptions[0] || null;
  const defaultSauce = (defaults.sauce && defaults.sauce[0]) || sauceOptions[0] || null;

  currentPizza = {
    id: data.id,
    name: data.name,
    description: data.description,
    base_price: Number(data.base_price),
    image: data.image,

    // single-valinnat
    base: defaultBase,
    sauce: defaultSauce,

    // juustot – kaikki vaihtoehdot, oletukset qty=1, muut 0
    cheese: (pizzaOptions.cheese || []).map((opt) => {
      const def = (defaults.cheese || []).find((d) => d.id === opt.id);
      return {
        ...opt,
        qty: def ? 1 : 0,
      };
    }),

    // täytteet – sama idea
    toppings: (pizzaOptions.topping || []).map((opt) => {
      const def = (defaults.topping || []).find((d) => d.id === opt.id);
      return {
        ...opt,
        qty: def ? 1 : 0,
      };
    }),
  };
}

function openPizzaModal() {
  document.getElementById("modal-pizza-img").src =
    "kuvat/" + currentPizza.image;
  document.getElementById("modal-pizza-name").textContent = currentPizza.name;
  document.getElementById("modal-pizza-desc").textContent =
    currentPizza.description;

  renderToppings();
  updatePrice();

  pizzaModal.classList.remove("hidden");
}

if (closePizzaModal) {
  closePizzaModal.addEventListener("click", () =>
    pizzaModal.classList.add("hidden")
  );
}

// =======================
//  TÄYTTEIDEN NÄYTTÄMINEN
// =======================

function renderToppings() {
  const baseList = document.getElementById("modal-base");
  const sauceList = document.getElementById("modal-sauce");
  const cheeseList = document.getElementById("modal-cheese");
  const topList = document.getElementById("modal-toppings");

  baseList.innerHTML = "";
  sauceList.innerHTML = "";
  cheeseList.innerHTML = "";
  topList.innerHTML = "";

  // --- POHJA (single select / dropdown) ---
  if (pizzaOptions.base && pizzaOptions.base.length) {
    const select = document.createElement("select");
    select.id = "base-select";

    pizzaOptions.base.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent =
        t.name + (t.price > 0 ? ` (+€${Number(t.price).toFixed(2)})` : "");
      if (currentPizza.base && currentPizza.base.id === t.id) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      const id = Number(select.value);
      const chosen = pizzaOptions.base.find((t) => t.id === id);
      currentPizza.base = chosen || null;
      updatePrice();
    });

    baseList.appendChild(select);
  }

  // --- KASTIKE (single select / dropdown) ---
  if (pizzaOptions.sauce && pizzaOptions.sauce.length) {
    const select = document.createElement("select");
    select.id = "sauce-select";

    pizzaOptions.sauce.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent =
        t.name + (t.price > 0 ? ` (+€${Number(t.price).toFixed(2)})` : "");
      if (currentPizza.sauce && currentPizza.sauce.id === t.id) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      const id = Number(select.value);
      const chosen = pizzaOptions.sauce.find((t) => t.id === id);
      currentPizza.sauce = chosen || null;
      updatePrice();
    });

    sauceList.appendChild(select);
  }

  // --- JUUSTOT (multi + qty) ---
  currentPizza.cheese.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.name} ${
      t.price > 0 ? "(+€" + Number(t.price).toFixed(2) + ")" : ""
    }</span>
      <span>
        <button class="minus-t" data-type="cheese" data-i="${i}">−</button>
        x${t.qty}
        <button class="plus-t" data-type="cheese" data-i="${i}">+</button>
      </span>
    `;
    cheeseList.appendChild(li);
  });

  // --- TÄYTTEET (multi + qty) ---
  currentPizza.toppings.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.name} ${
      t.price > 0 ? "(+€" + Number(t.price).toFixed(2) + ")" : ""
    }</span>
      <span>
        <button class="minus-t" data-type="topping" data-i="${i}">−</button>
        x${t.qty}
        <button class="plus-t" data-type="topping" data-i="${i}">+</button>
      </span>
    `;
    topList.appendChild(li);
  });
}

// =======================
//  HINNAN LASKEMINEN
// =======================

function updatePrice() {
  let total = Number(currentPizza.base_price);

  // pohjan lisähinta
  if (currentPizza.base) {
    total += Number(currentPizza.base.price || 0);
  }

  // kastikkeen lisähinta
  if (currentPizza.sauce) {
    total += Number(currentPizza.sauce.price || 0);
  }

  // juustot
  total += currentPizza.cheese.reduce((sum, t) => {
    return sum + (t.qty || 0) * Number(t.price || 0);
  }, 0);

  // täytteet
  total += currentPizza.toppings.reduce((sum, t) => {
    return sum + (t.qty || 0) * Number(t.price || 0);
  }, 0);

  document.getElementById("modal-price").textContent = total.toFixed(2);
}

// =======================
//  + / − painikkeet
// =======================

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("plus-t") ||
    e.target.classList.contains("minus-t")
  ) {
    const type = e.target.dataset.type; // cheese / topping
    const idx = Number(e.target.dataset.i);

    const arr = type === "cheese" ? currentPizza.cheese : currentPizza.toppings;

    if (!arr[idx]) return;

    if (e.target.classList.contains("plus-t")) {
      arr[idx].qty++;
    } else {
      arr[idx].qty--;
      if (arr[idx].qty < 0) arr[idx].qty = 0; // 0 = ei valittuna
    }

    renderToppings();
    updatePrice();
  }
});

// =======================
//  LISÄÄ MODAALISTA OSTOSKORIIN
// =======================

if (modalAddToCartBtn) {
  modalAddToCartBtn.addEventListener("click", () => {
    if (!currentPizza) return;

    // Rakennetaan ostoskorituote
    const item = buildCurrentPizzaCartItem();

    if (window.addCustomPizzaToCart) {
      window.addCustomPizzaToCart(item);
    } else {
      console.warn("addCustomPizzaToCart-funktiota ei löytynyt");
    }

    pizzaModal.classList.add("hidden");
  });
}

function buildCurrentPizzaCartItem() {
  const selectedCheese = currentPizza.cheese.filter((t) => t.qty > 0);
  const selectedToppings = currentPizza.toppings.filter((t) => t.qty > 0);

  let total = Number(currentPizza.base_price);

  if (currentPizza.base) total += Number(currentPizza.base.price || 0);
  if (currentPizza.sauce) total += Number(currentPizza.sauce.price || 0);

  total += selectedCheese.reduce(
    (sum, t) => sum + t.qty * Number(t.price || 0),
    0
  );
  total += selectedToppings.reduce(
    (sum, t) => sum + t.qty * Number(t.price || 0),
    0
  );

  // Uniikki ID täytevalintojen perusteella
  const keyParts = [
    `b:${currentPizza.base ? currentPizza.base.id : "0"}`,
    `s:${currentPizza.sauce ? currentPizza.sauce.id : "0"}`,
    `c:${selectedCheese.map((t) => `${t.id}x${t.qty}`).join(",")}`,
    `t:${selectedToppings.map((t) => `${t.id}x${t.qty}`).join(",")}`,
  ];
  const configKey = keyParts.join("|");

  return {
    id: `pizza-${currentPizza.id}-${configKey}`,
    type: "pizza",
    name: currentPizza.name,
    base: currentPizza.base,
    sauce: currentPizza.sauce,
    cheese: selectedCheese,
    toppings: selectedToppings,
    price: Number(total.toFixed(2)), // yksittäisen pizzan hinta
    quantity: 1,
    img: "kuvat/" + currentPizza.image,
  };
}
