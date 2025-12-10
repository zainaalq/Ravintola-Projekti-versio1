function requireAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "admin-login.html";
  }
  return token;
}

let editingId = null;

async function loadPizzas() {
  const token = requireAdmin();

  const res = await fetch("/api/admin/pizzas", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) {
    console.error(await res.text());
    alert("Pizzojen lataus epäonnistui (admin).");
    return;
  }

  const pizzas = await res.json();
  const tbody = document.getElementById("pizza-body");
  tbody.innerHTML = "";

  pizzas.forEach((p) => {
    const imgSrc = p.image || "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>€${Number(p.price).toFixed(2)}</td>
      <td>
        ${imgSrc ? `<img src="${imgSrc}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">` : ""}
      </td>
      <td>
        <button class="btn-edit">Muokkaa</button>
        <button class="btn-delete">Poista</button>
      </td>
    `;

    tr.querySelector(".btn-edit").addEventListener("click", () => openEditModal(p));
    tr.querySelector(".btn-delete").addEventListener("click", () => deletePizza(p.id));

    tbody.appendChild(tr);
  });
}

function openAddModal() {
  editingId = null;
  document.getElementById("modal-title").innerText = "Lisää pizza";

  document.getElementById("p-name").value = "";
  document.getElementById("p-desc").value = "";
  document.getElementById("p-price").value = "";
  document.getElementById("p-image").value = "";
  document.getElementById("old-image").value = "";

  document.getElementById("modal").style.display = "flex";
}

function openEditModal(pizza) {
  editingId = pizza.id;
  document.getElementById("modal-title").innerText = "Muokkaa pizzaa";

  document.getElementById("p-name").value = pizza.name;
  document.getElementById("p-desc").value = pizza.description || "";
  document.getElementById("p-price").value = pizza.price;
  document.getElementById("p-image").value = "";
  document.getElementById("old-image").value = pizza.image ? pizza.image.split("/").pop() : "";

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function backgroundClose(e) {
  if (e.target.id === "modal") {
    closeModal();
  }
}

async function savePizza() {
  const token = requireAdmin();

  const name = document.getElementById("p-name").value.trim();
  const desc = document.getElementById("p-desc").value.trim();
  const price = document.getElementById("p-price").value;
  const imageInput = document.getElementById("p-image");
  const oldImage = document.getElementById("old-image").value;

  if (!name || !price) {
    alert("Nimi ja hinta ovat pakollisia.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", desc);
  formData.append("base_price", price);

  if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  } else if (editingId && oldImage) {
    formData.append("old_image", oldImage);
  }

  const url = editingId
    ? `/api/admin/pizzas/${editingId}`
    : "/api/admin/pizzas";

  const method = editingId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: "Bearer " + token
    },
    body: formData
  });

  if (!res.ok) {
    console.error(await res.text());
    alert("Tallennus epäonnistui.");
    return;
  }

  closeModal();
  loadPizzas();
}

async function deletePizza(id) {
  const token = requireAdmin();
  if (!confirm("Poistetaanko pizza?")) return;

  const res = await fetch(`/api/admin/pizzas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) {
    console.error(await res.text());
    alert("Poisto epäonnistui.");
    return;
  }

  loadPizzas();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPizzas();
});
