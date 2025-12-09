/* ==================================
    ADMIN-TOKEN
=================================== */
function requireAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) location.href = "admin-login.html";
  return token;
}

let editingId = null;

/* ==================================
    LADATAAN JUOMAT
=================================== */
async function loadDrinks() {
  const res = await fetch("/api/admin/drinks", {
    headers: { Authorization: "Bearer " + requireAdmin() },
  });

  const drinks = await res.json();
  const tbody = document.getElementById("drinks-body");
  tbody.innerHTML = "";

  drinks.forEach((d) => {
    tbody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.small_price} €</td>
        <td>${d.large_price} €</td>
        <td>
  <img src="/kuvat/${d.image}" 
       style="width:60px; height:auto; border-radius:6px;">
</td>


        <td>
          <button class="btn-edit" onclick='openEditModal(${JSON.stringify(d)})'>Muokkaa</button>
          <button class="btn-delete" onclick="deleteDrink(${d.id})">Poista</button>
        </td>
      </tr>
    `;
  });
}

loadDrinks();

/* ==================================
      MODAALIN AVAUS (UUSI)
=================================== */
function openAddModal() {
  editingId = null;

  document.getElementById("modal-title").innerText = "Lisää juoma";
  document.getElementById("d-name").value = "";
  document.getElementById("d-small").value = "";
  document.getElementById("d-large").value = "";
  document.getElementById("old-image").value = "";
  document.getElementById("d-image").value = "";

  document.getElementById("modal").classList.remove("hidden");
}

/* ==================================
      MODAALIN AVAUS (MUOKKAA)
=================================== */
function openEditModal(d) {
  editingId = d.id;

  document.getElementById("modal-title").innerText = "Muokkaa juomaa";
  document.getElementById("d-name").value = d.name;
  document.getElementById("d-small").value = d.small_price;
  document.getElementById("d-large").value = d.large_price;

  document.getElementById("old-image").value = d.image;
  document.getElementById("d-image").value = "";

  document.getElementById("modal").classList.remove("hidden");
}

/* ==================================
      MODAALIN SULKU
=================================== */
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

/* ==================================
      TALLENNUS (LISÄYS + MUOKKAUS)
=================================== */
async function saveDrink() {
  const form = new FormData();
  form.append("name", document.getElementById("d-name").value);
  form.append("small_price", document.getElementById("d-small").value);
  form.append("large_price", document.getElementById("d-large").value);

  const file = document.getElementById("d-image").files[0];
  if (file) form.append("image", file);
  else form.append("old_image", document.getElementById("old-image").value);

  const url = editingId
    ? `/api/admin/drinks/${editingId}`
    : `/api/admin/drinks`;

  const method = editingId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { Authorization: "Bearer " + requireAdmin() },
    body: form,
  });

  closeModal();
  loadDrinks();
}

/* ==================================
      POISTO
=================================== */
async function deleteDrink(id) {
  if (!confirm("Poistetaanko juoma?")) return;

  await fetch(`/api/admin/drinks/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + requireAdmin() },
  });

  loadDrinks();
}
