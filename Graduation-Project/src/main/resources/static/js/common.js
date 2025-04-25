document.addEventListener("DOMContentLoaded", function () {
    fetch("/DATN/includes/navigation-bar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navigation-bar").innerHTML = data;

            // GÁN SỰ KIỆN SAU KHI ĐÃ GÁN HTML XONG
            const toggleBtn = document.getElementById("menu-toggle");
            const menu = document.getElementById("mobile-menu");

            if (toggleBtn && menu) {
                toggleBtn.addEventListener("click", function () {
                    menu.classList.toggle("hidden");
                });
            }
        });

    fetch("/DATN/includes/footer-placeholder.html")
        .then(res => res.text())
        .then(data => document.getElementById("footer-placeholder").innerHTML = data);

    fetch("/DATN/includes/brand.html")
        .then(res => res.text())
        .then(data => document.getElementById("brand-section").innerHTML = data);
});

