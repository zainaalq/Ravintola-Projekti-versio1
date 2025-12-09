// ============================
// PIZZAHALLINTA – ADMIN
// ============================

const tbody = document.getElementById("pizza-body");
let editId = null;

// ============================
// LATAA PIZZAT
// ============================
async function loadPizzas() {
  const res = await fetch("/api/menu");
  const pizzas = await res.json();

  tbody.innerHTML = "";

  pizzas.forEach((p) => {
    const row = document.createElement("tr");

    // ---- OIKEA KUVA-POLKU ----
    const imagePath = p.image ? `/kuvat/${p.image}` : "";

    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>€${Number(p.base_price).toFixed(2)}</td>

      <td>
        ${
          imagePath
            ? `<img src="${imagePath}" style="width:60px; height:auto; border-radius:6px;">`
            : "Ei kuvaa"
        }
      </td>

      <td>
        <button class="btn-edit"
          onclick="openEdit(${p.id},
                           \`${p.name}\`,
                           \`${p.description}\`,
                           \`${p.base_price}\`,
                           \`${p.image}\`)">
          Muokkaa
        </button>

        <button class="btn-delete" onclick="deletePizza(${p.id})">
          Poista
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ============================
// MODAALIN AVAUS: MUOKKAUS
// ============================
function openEdit(id, name, desc, price, image) {
  editId = id;

  document.getElementById("modal-title").textContent = "Muokkaa pizzaa";

  document.getElementById("p-name").value = name;
  document.getElementById("p-desc").value = desc;
  document.getElementById("p-price").value = price;

  document.getElementById("old-image").value = image;

  document.getElementById("modal").style.display = "flex";
}

// ============================
// MODAALIN AVAUS: LISÄÄ PIZZA
// ============================
function openAddModal() {
  editId = null;

  document.getElementById("modal-title").textContent = "Lisää pizza";

  document.getElementById("p-name").value = "";
  document.getElementById("p-desc").value = "";
  document.getElementById("p-price").value = "";

  document.getElementById("old-image").value = "";

  document.getElementById("modal").style.display = "flex";
}

// ============================
// SULJE MODAALI
// ============================
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function backgroundClose(e) {
  if (e.target.id === "modal") closeModal();
}

// ============================
// TALLENNA PIZZA (UUSI TAI MUOKKAUS)
// ============================
async function savePizza() {
  const name = document.getElementById("p-name").value;
  const desc = document.getElementById("p-desc").value;
  const price = document.getElementById("p-price").value;

  const image = document.getElementById("p-image").files[0];
  const oldImage = document.getElementById("old-image").value;

  const form = new FormData();
  form.append("name", name);
  form.append("description", desc);
  form.append("base_price", price);
  form.append("old_image", oldImage);

  if (image) form.append("image", image);

  const url = editId
    ? `/api/admin/pizzas/${editId}`
    : `/api/admin/pizzas`;

  await fetch(url, {
    method: editId ? "PUT" : "POST",
    body: form,
  });

  closeModal();
  loadPizzas();
}

// ============================
// POISTA PIZZA
// ============================
async function deletePizza(id) {
  if (!confirm("Haluatko poistaa tämän pizzan?")) return;

  await fetch(`/api/admin/pizzas/${id}`, {
    method: "DELETE",
  });

  loadPizzas();
}

// ============================
// ALUSTA
// ============================
document.addEventListener("DOMContentLoaded", loadPizzas);
