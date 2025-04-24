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

async function updateCartCountFromAPI() {
    const username = localStorage.getItem("username");
    if (!username) return;  // chưa login thì bỏ qua

    try {
        const res = await fetch(`http://localhost:8080/DATN/cart/findAll?user=${username}`);
        const json = await res.json();

        // Giả sử API trả về { data: [...] }
        const items = Array.isArray(json.data) ? json.data : [];

        // Tính tổng số lượng sản phẩm
        const count = items.reduce((sum, item) => sum + item.quantity, 0);

        // Cập nhật số lượng vào badge giỏ hàng
        document.getElementById("cartCount").innerText = count;
    } catch (err) {
        console.error("Không thể tải số lượng giỏ hàng:", err);
    }
}

// Gọi khi trang load
window.addEventListener("DOMContentLoaded", () => {
    updateCartCountFromAPI();
});