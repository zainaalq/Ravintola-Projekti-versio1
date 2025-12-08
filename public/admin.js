// =======================
// ADMIN – TILAUSTEN LISTAUS
// =======================

let currentEditOrder = null;

// Lataa kaikki tilaukset taulukkoon
async function loadOrders() {
    const res = await fetch("/api/orders");
    const orders = await res.json();

    const tbody = document.querySelector("#orders-table tbody");
    tbody.innerHTML = "";

    orders.forEach(order => {
        const row = document.createElement("tr");

        const itemsList = order.items
            .map(i => `${i.item_name} x${i.quantity}`)
            .join("<br>");

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.phone}</td>
            <td>${itemsList}</td>
            <td>€${Number(order.total_price).toFixed(2)}</td>

            <td>
                <select onchange="updateStatus(${order.id}, this.value)">
                    <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pending</option>
                    <option value="in_progress" ${order.status === "in_progress" ? "selected" : ""}>In progress</option>
                    <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
                </select>
            </td>

            <td>
                <button class="edit-btn" onclick="openOrderEditor(${order.id})">Muokkaa</button>
                <button class="delete-btn" onclick="deleteOrder(${order.id})">Poista</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// =======================
// TILAN PÄIVITYS
// =======================
async function updateStatus(id, status) {
    await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });

    loadOrders();
}

// =======================
// TILAAUKSEN POISTO
// =======================
async function deleteOrder(id) {
    if (!confirm("Poistetaanko tilaus?")) return;

    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    loadOrders();
}

// =======================
// TILAAUKSEN MUOKKAUSMODAALI
// =======================

// Avaa editointi
async function openOrderEditor(id) {
    const res = await fetch(`/api/orders/${id}`);
    const order = await res.json();

    currentEditOrder = order;

    document.getElementById("edit-order-id").textContent = order.id;
    document.getElementById("edit-customer").value = order.customer_name;
    document.getElementById("edit-phone").value = order.phone;
    document.getElementById("edit-status").value = order.status;

    renderEditItems();

    document.getElementById("edit-modal").classList.remove("hidden");
}

// Renderöi tuotteet
function renderEditItems() {
    const box = document.getElementById("edit-items");
    box.innerHTML = "";

    currentEditOrder.items.forEach((item, i) => {
        const div = document.createElement("div");
        div.classList.add("edit-item");

        div.innerHTML = `
            <span>${item.item_name} (€${item.price})</span>

            <input type="number" min="1" value="${item.quantity}"
                onchange="changeQty(${i}, this.value)">

            <button onclick="removeItem(${i})">Poista</button>
        `;

        box.appendChild(div);
    });

    updateEditTotal();
}

// Määrän muutos
function changeQty(i, qty) {
    currentEditOrder.items[i].quantity = Number(qty);
    updateEditTotal();
}

// Poista tuote
function removeItem(i) {
    currentEditOrder.items.splice(i, 1);
    renderEditItems();
}

// Laske uusi hinta
function updateEditTotal() {
    const total = currentEditOrder.items.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    currentEditOrder.total_price = total;
    document.getElementById("edit-total").textContent = total.toFixed(2);
}

// =======================
// TALLENNA TILAUKSEN MUUTOKSET
// =======================

async function saveOrder() {
    const payload = {
        customer_name: document.getElementById("edit-customer").value,
        phone: document.getElementById("edit-phone").value,
        status: document.getElementById("edit-status").value,
        items: currentEditOrder.items,
        total_price: currentEditOrder.total_price
    };

    await fetch(`/api/orders/${currentEditOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    closeEditor();
    loadOrders();
}

document.getElementById("save-order-btn").onclick = saveOrder;

// Sulje modaali
function closeEditor() {
    document.getElementById("edit-modal").classList.add("hidden");
}

// Lataa tilaukset sisään
loadOrders();

