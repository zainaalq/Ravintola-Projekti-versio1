/* ============================
    VAADI ADMIN-KIRJAUTUMINEN
============================ */
function requireAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) window.location.href = "admin-login.html";
  return token;
}

/* ============================
    SIIVOA PÄIVÄMÄÄRÄ MUOTOILU
============================ */
function formatDate(dateString) {
  if (!dateString) return "-";

  const d = new Date(dateString);

  return (
    d.toLocaleDateString("fi-FI") +
    " klo " +
    d.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );
}

/* ============================
        LATAA KÄYTTÄJÄT
============================ */
async function loadUsers() {
  const token = requireAdmin();

  const res = await fetch("/api/admin/users", {
    headers: { Authorization: "Bearer " + token }
  });

  if (!res.ok) {
    alert("Virhe käyttäjien latauksessa.");
    return;
  }

  const users = await res.json();
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = "";

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.customer_id}</td>

        <td>${u.name}</td>


        <td>${u.phone || "-"}</td>

        <td>${formatDate(u.first_order)}</td>

        <td>
          <button class="delete-btn" onclick="deleteUser(${u.customer_id})">
            Poista
          </button>
        </td>
      </tr>
    `;
  });
}

/* ============================
       POISTA KÄYTTÄJÄ
============================ */
async function deleteUser(id) {
  const token = requireAdmin();

  if (!confirm("Haluatko varmasti poistaa tämän käyttäjän JA sen tilaukset?"))
    return;

  const res = await fetch(`/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  if (!res.ok) {
    alert("Poistaminen epäonnistui.");
    return;
  }

  loadUsers();
}

loadUsers();
