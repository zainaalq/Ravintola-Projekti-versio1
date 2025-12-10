
async function loadDailyDeal() {
  try {
    const res = await fetch("/api/dailydeal");
    const deal = await res.json();

    if (!deal || !deal.pizza || !deal.drink) {
      console.warn("Daily deal missing or invalid");
      return;
    }

    const box = document.getElementById("daily-deal-box");
    const content = document.getElementById("deal-content");

    function fixImagePath(path) {
      if (!path) return "";
      if (path.startsWith("http")) return path;
      if (path.startsWith("/")) return path;

      if (!path.includes("kuvat/")) return "/uploads/" + path;

      return "/" + path;
    }

    const pizzaImg = fixImagePath(deal.pizza.image);
    const drinkImg = fixImagePath(deal.drink.image);

    const pizzaPrice = Number(deal.pizza.base_price);
    const drinkPrice = Number(deal.drink.price);
    const discount = Number(deal.discount);

    const totalBefore = (pizzaPrice + drinkPrice).toFixed(2);
    const totalAfter = (totalBefore * (1 - discount / 100)).toFixed(2);

    const d = new Date(deal.date);
    const dateFormatted = d.toLocaleDateString("fi-FI");

    content.innerHTML = `
      <div class="deal-header">
        <h2>Päivän kampanja — ${dateFormatted}</h2>
      </div>

      <div class="deal-grid">

        <div class="deal-item">
          <h3>${deal.pizza.name}</h3>
          <img src="${pizzaImg}">
          <p>Norm: €${pizzaPrice.toFixed(2)}</p>
        </div>

        <div class="deal-item">
          <h3>${deal.drink.name}</h3>
          <img src="${drinkImg}">
          <p>Hinta: €${drinkPrice.toFixed(2)}</p>
          <p>Juoma kuuluu kampanjaan</p>
        </div>

      </div>

      <div class="deal-summary">
        <p>Yhteensä ennen alea: <b>€${totalBefore}</b></p>
        <p>Alennus: <b>${discount}%</b></p>
        <p class="deal-final">Yhteishinta tänään: <b>€${totalAfter}</b></p>
      </div>
    `;

    box.classList.remove("hidden");

  } catch (err) {
    console.error("Daily deal error:", err);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  loadDailyDeal();

  const menuBtn = document.querySelector(".fa-bars");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenu = document.getElementById("close-mobile-menu");
  const overlay = document.getElementById("menu-overlay");

  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      mobileMenu.classList.add("active");
      overlay.classList.add("active");
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
});
