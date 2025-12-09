function requireAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) window.location.href = "admin-login.html";
  return token;
}

async function loadCustomerOrders() {
  const token = requireAdmin();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const res = await fetch(`/api/admin/users/${id}/orders`, {
    headers: { "Authorization": "Bearer " + token }
  });

  if (!res.ok) {
    alert("Virhe tilausten latauksessa.");
    return;
  }

  const orders = await res.json();
  const box = document.getElementById("orders-list");

  if (orders.length === 0) {
    box.innerHTML = "<p>Ei tilauksia.</p>";
    return;
  }

  box.innerHTML = orders.map(order => `
    <div class="order-card">
      <h2>Tilaus #${order.id}</h2>
      <p><strong>Päivä:</strong> ${order.created_at}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Yhteensä:</strong> €${order.total_price}</p>

      <h3>Tuotteet:</h3>
      <ul>
        ${order.items.map(i => `
          <li>
            ${i.item_name} — €${i.price} x ${i.quantity}
            ${i.config ? `<div>${i.config}</div>` : ""}
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("");
}

loadCustomerOrders();
