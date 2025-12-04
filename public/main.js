// Lataa sivu sisällöllä
function loadPage(page) {
    fetch("pages/" + page + ".html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("page-content").innerHTML = data;
        });
}

// Klikkauksien kuuntelu navbarissa
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        loadPage(page);
    });
});

// Lataa etusivu automaattisesti
loadPage("home");
