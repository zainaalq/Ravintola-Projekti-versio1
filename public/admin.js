async function loadOrders() {
    const res = await fetch("/api/admin/orders", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken")
        }
    });

    const orders = await res.json();
    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    orders.forEach(order => {
        const card = document.createElement("div");
        card.classList.add("order-card");
        card.setAttribute("data-order", order.id);

        let productsHTML = order.items.map(item => {
            return `
                <li>
                    <div class="item-main">
                        <div>
                            <span class="item-name">${item.item_name}</span>
                            <span class="item-qty">x${item.quantity}</span>
                        </div>
                        <span class="item-price">€${item.price}</span>
                    </div>
                    ${renderPrettyConfig(item.config)}
                </li>
            `;
        }).join("");

        const deliveredClass = order.status === "delivered" ? "delivered" : "pending";

        card.innerHTML = `
            <div class="order-header">
                <div>
                    <h3>Tilaus #${order.id} — ${order.customer_name}</h3>
                    <div class="order-meta">Puhelin: ${order.phone}</div>
                </div>

                <div class="order-status ${deliveredClass}">
                    ${order.status.toUpperCase()}
                </div>
            </div>

            <ul class="order-products">
                ${productsHTML}
            </ul>

            <div class="order-footer">
                <div class="order-total">Yhteensä: <span>€${order.total_price}</span></div>

                <div class="order-actions">
                    <button class="btn complete-btn" onclick="markDelivered(${order.id})">
                        Merkitse valmiiksi
                    </button>
                    <button class="btn delete-btn" onclick="deleteOrder(${order.id})">Poista</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function renderPrettyConfig(config) {
    if (!config) return "";

    try {
        const data = JSON.parse(config);
        let out = [];

        if (data.base) out.push(`<strong>Pohja:</strong> ${data.base.name}`);
        if (data.sauce) out.push(`<strong>Kastike:</strong> ${data.sauce.name}`);

        if (data.cheese?.length) {
            out.push(`<strong>Juusto:</strong> ` +
                data.cheese.map(c => `${c.name} x${c.qty}`).join(", "));
        }

        if (data.toppings?.length) {
            out.push(`<strong>Täytteet:</strong> ` +
                data.toppings.map(t => `${t.name} x${t.qty}`).join(", "));
        }

        return `<div class="item-config">${out.join("<br>")}</div>`;
    } catch {
        return "";
    }
}

async function markDelivered(id) {
    const card = document.querySelector(`[data-order="${id}"]`);
    if (card) {
        card.style.transition = "0.4s";
        card.style.background = "#e3ffea";
    }

    await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("adminToken")
        },
        body: JSON.stringify({ status: "delivered" })
    });

    setTimeout(() => loadOrders(), 400);
}

async function deleteOrder(id) {
    if (!confirm("Poistetaanko tilaus?")) return;

    await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
    });

    loadOrders();
}

loadOrders();