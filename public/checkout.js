"use strict";


let cart = JSON.parse(localStorage.getItem("cart")) || [];


function renderOrderSummary() {
  const summary = document.getElementById("order-summary");
  summary.innerHTML = "";

  if (cart.length === 0) {
    summary.innerHTML = "<p>Ostoskorisi on tyhjä.</p>";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const div = document.createElement("div");
    div.classList.add("checkout-item");

    div.innerHTML = `
      <p><strong>${item.name}</strong> 
      ${item.size ? `(${item.size})` : ""} x${item.quantity}</p>
      <p>€${lineTotal.toFixed(2)}</p>
      <hr>
    `;

    summary.appendChild(div);
  });

  const totalEl = document.createElement("h3");
  totalEl.textContent = `Yhteensä: €${total.toFixed(2)}`;
  summary.appendChild(totalEl);
}

renderOrderSummary();


document.getElementById("checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Ostoskorisi on tyhjä!");
    return;
  }

  const customerName = document.getElementById("customer-name").value;
  const phone = document.getElementById("phone").value;

  
  const orderData = {
    customer_name: customerName,
    phone,
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || null,
      config: item.type === "pizza"
        ? {
            base: item.base,
            sauce: item.sauce,
            cheese: item.cheese,
            toppings: item.toppings
          }
        : null
    }))
  };

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.success) {
      localStorage.removeItem("cart");

      document.getElementById("checkout-form").style.display = "none";
      document.getElementById("order-summary").style.display = "none";

      const box = document.createElement("div");
      box.classList.add("order-success-box");

      box.innerHTML = `
        <h1>🎉 Tilaus vahvistettu!</h1>
        <p>Tilauksesi numero:</p>
        <h2>#${data.order_id}</h2>
        <p>Arvioitu toimitusaika: <strong>25–35 minuuttia</strong></p>

        <button class="home-btn" onclick="window.location.href='1.html'">
          Palaa etusivulle
        </button>
      `;

      document.body.appendChild(box);
    } else {
      alert("Tilaus epäonnistui. Yritä uudelleen.");
    }

  } catch (err) {
    console.error(err);
    alert("Palvelinvirhe — tilausta ei voitu tehdä.");
  }
});
