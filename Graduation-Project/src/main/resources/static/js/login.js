window.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const loginLink = document.getElementById("loginLink");
    const userDropdown = document.getElementById("userDropdown");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");
    const userInfo = document.getElementById("userInfo");
    const dropdownMenu = document.getElementById("dropdownMenu");

    const manageAccountLink = document.getElementById("manageAccountLink");
    const manageBrandLink = document.getElementById("manageBrandLink");
    const manageDiscountLink = document.getElementById("manageDiscountLink");
    const manageOrderLink = document.getElementById("manageOrderLink");
    const manageProductLink = document.getElementById("manageProductLink");
    const manageImportLink = document.getElementById("manageImportLink");
    const manageWarehouseLink = document.getElementById("manageWarehouseLink");

    userInfo.addEventListener("click", function () {
        dropdownMenu.classList.toggle("hidden");
    });

    if (username && token) {
        loginLink.classList.add("hidden");
        userDropdown.classList.remove("hidden");
        usernameDisplay.textContent = username;

        if (role === "ROLE_ADMIN" || role === "ROLE_EMPLOYEE") {
            manageAccountLink.classList.remove("hidden");
            manageBrandLink.classList.remove("hidden");
            manageDiscountLink.classList.remove("hidden");
            manageOrderLink.classList.remove("hidden");
            manageProductLink.classList.remove("hidden");
            manageImportLink.classList.remove("hidden");
            manageWarehouseLink.classList.remove("hidden");

        }

        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");  // Xóa role khi đăng xuất

            loginLink.classList.remove("hidden");
            userDropdown.classList.add("hidden");
        });
    }

    document.addEventListener("click", function (event) {
        const isClickInside = userInfo.contains(event.target) || dropdownMenu.contains(event.target);
        if (!isClickInside) {
            dropdownMenu.classList.add("hidden");
        }
    });
});
