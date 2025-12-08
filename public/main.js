// ...existing code...
// Lataa sivu sisällöllä (yrittää useita polkuja ja suorittaa scriptit)
function loadPage(page) {
    const paths = [
        `pages/${page}.html`,
        `${page}.html`,
        `public/${page}.html`
    ];

    (async () => {
        let data = null;
        for (const p of paths) {
            try {
                const resp = await fetch(p);
                if (!resp.ok) continue;
                data = await resp.text();
                break;
            } catch (err) {
                // jatka seuraavaan polkuun
            }
        }

        if (data === null) {
            document.getElementById("page-content").innerHTML = `<p>Sivua ei löytynyt: ${page}</p>`;
            return;
        }

        const container = document.getElementById("page-content");
        container.innerHTML = data;

        // Suorita ladatut <script> tagit (ulkoinen ja inline)
        container.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
                newScript.async = false;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            // poista vanha skripti tai jätä — ei ole välttämätöntä
            oldScript.remove();
        });
    })();
}


document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeMenu = document.getElementById("close-mobile-menu");
    const overlay = document.getElementById("menu-overlay");

    menuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mobileMenu.classList.add("active");
        overlay.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");
    });
});
