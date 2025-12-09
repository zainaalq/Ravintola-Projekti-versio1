// =========================
// 🔑 Jos token on jo olemassa,
// mene suoraan admin-dashboardiin
// =========================
(function autoRedirectIfLoggedIn() {
  const token = localStorage.getItem("adminToken");
  if (token) {
    fetch("/api/admin/check", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          // Token on validi → suoraan dashboardiin
          window.location.href = "admin-dashboard.html";
        } else {
          // Token ei kelpaa → poistetaan
          localStorage.removeItem("adminToken");
        }
      })
      .catch(() => {
        // Jos virhe tarkistuksessa, ei tehdä mitään
      });
  }
})();

// =========================
// 📨 Viestin näyttö
// =========================
function setMessage(text, isError = true) {
  const msg = document.getElementById("msg");
  if (!msg) return;

  msg.textContent = text || "";
  msg.style.color = isError ? "red" : "green";
}

// =========================
// 🔐 Admin Login
// =========================
async function login() {
  const username = document.getElementById("log-user")?.value.trim();
  const password = document.getElementById("log-pass")?.value.trim();

  if (!username || !password) {
    setMessage("Syötä käyttäjänimi ja salasana.");
    return;
  }

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage(data.message || "Kirjautuminen epäonnistui.");
      return;
    }

    // Talleta token
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    setMessage("Kirjautuminen onnistui!", false);

    // Pieni viive ja sitten dashboardiin
    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 400);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setMessage("Serverivirhe kirjautuessa.");
  }
}

// =========================
// 🟩 Admin Rekisteröinti
// =========================
async function registerAdmin() {
  const email = document.getElementById("reg-email")?.value.trim();
  const username = document.getElementById("reg-user")?.value.trim();
  const password = document.getElementById("reg-pass")?.value.trim();

  if (!email || !username || !password) {
    setMessage("Täytä kaikki rekisteröintikentät.");
    return;
  }

  if (!email.endsWith("@admin.com")) {
    setMessage("Sähköpostin tulee päättyä @admin.com");
    return;
  }

  try {
    const res = await fetch("/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setMessage(data.message || "Rekisteröinti epäonnistui.");
      return;
    }

    setMessage("Rekisteröinti onnistui! Voit nyt kirjautua.", false);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    setMessage("Serverivirhe rekisteröinnissä.");
  }
}

// =========================
// 🌍 Tee funktiot globaaleiksi
// =========================
window.login = login;
window.registerAdmin = registerAdmin;
