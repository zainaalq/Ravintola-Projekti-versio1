// ===============================
// LATAA JUOMAT BACKENDISTA
// ===============================
async function loadDrinks() {
  try {
    const res = await fetch("/api/drinks");
    const drinks = await res.json();

    const container = document.getElementById("drinks-container");
    container.innerHTML = "";

    drinks.forEach((drink) => {
      const card = document.createElement("div");
      card.classList.add("drink-card");

      // Luo radio-napit
      let sizeOptionsHTML = "";
      let firstPrice = drink.sizes[0]?.price ?? 0;

      drink.sizes.forEach((s, index) => {
        sizeOptionsHTML += `
          <label>
            <input type="radio" 
              name="drink-${drink.id}" 
              data-size="${s.size}"
              data-price="${s.price}"
              ${index === 0 ? "checked" : ""}>
            ${s.size} (€${Number(s.price).toFixed(2)})
          </label>
        `;
      });

      // 🔥 TÄRKEÄ KORJAUS: oikea kuva-polku
      // Vanha: kuvat/juomat/${drink.image}
      // Uusi: /kuvat/${drink.image}
      const imageUrl = `/kuvat/${drink.image}`;

      // Luo kortin sisältö
      card.innerHTML = `
        <img src="${imageUrl}" class="drink-img" alt="${drink.name}">

        <div class="drink-info">
          <h3 class="drink-name">${drink.name}</h3>

          <div class="size-options">${sizeOptionsHTML}</div>

          <div class="price-row">
            <p class="drink-price selected-price">€${Number(firstPrice).toFixed(2)}</p>

            <!-- Nappi lisää ostoskoriin — ostoskori.js hoitaa -->
            <button class="add-btn">+</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    enableDynamicPriceUpdates();

  } catch (err) {
    console.error("Juomien latausvirhe:", err);
  }
}


// ===============================
// DYNAAMINEN HINNAN PÄIVITYS
// ===============================
function enableDynamicPriceUpdates() {
  document.querySelectorAll(".size-options input").forEach(radio => {
    radio.addEventListener("change", () => {
      const card = radio.closest(".drink-card");
      const priceLabel = card.querySelector(".selected-price");

      priceLabel.textContent =
        "€" + Number(radio.dataset.price).toFixed(2);
    });
  });
}


// ===============================
// LATAA JUOMAT SIVUN AVAUKSESSA
// ===============================
document.addEventListener("DOMContentLoaded", loadDrinks);
