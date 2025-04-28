const pageSize = 8;
let currentPage = 1;
let allAccounts = [];
const role = localStorage.getItem("role");

const accountTable = document.getElementById("accountTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

// Render tài khoản ra bảng
const renderAccounts = (accounts) => {
    accountTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAccounts = accounts.slice(startIndex, startIndex + pageSize);

    paginatedAccounts.forEach((a, index) => {
        const row = `
            <tr>
                <td class="px-4 py-2 border">${startIndex + index + 1}</td>
                <td class="px-4 py-2 border">
                    <a href="accountManagerDetail.html?code=${a.code}" class="text-blue-600 hover:underline">
                        ${a.fullName}
                    </a>
                </td>
                <td class="px-4 py-2 border">${a.code || ""}</td>
                <td class="px-4 py-2 border">${a.userName || ""}</td>
                <td class="px-4 py-2 border">${a.email || ""}</td>
                <td class="px-4 py-2 border">${a.address || ""}</td>
                <td class="px-4 py-2 border">${a.sex || ""}</td>
                <td class="px-4 py-2 border">${a.phone || ""}</td>
                <td class="px-4 py-2 border">${a.role || ""}</td>
                <td class="px-4 py-2 border font-bold ${a.isDeleted ? 'text-red-500' : 'text-green-600'}">
                    ${a.isDeleted ? '❌' : '✅'}
                </td>
                <td class="px-4 py-2 border space-x-2">
                    ${a.isDeleted
            ? `<button onclick="handleActivate('${a.code}')" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Kích hoạt</button>`
            : `<button onclick="handleDisable('${a.code}')" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Vô hiệu hóa</button>`
        }
                    <button onclick="handleDelete('${a.code}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Xóa</button>
                </td>
            </tr>
        `;
        accountTable.innerHTML += row;
    });

    renderPagination(accounts.length);
};

// Phân trang
const renderPagination = (totalItems) => {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / pageSize);

    const createPageButton = (label, enabled, onClick) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = `px-3 py-1 rounded ${enabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`;
        btn.disabled = !enabled;
        if (enabled) btn.addEventListener("click", onClick);
        paginationContainer.appendChild(btn);
    };

    createPageButton("← Trước", currentPage > 1, () => {
        currentPage--;
        renderAccounts(filteredAccounts());
    });

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderAccounts(filteredAccounts());
        });
        paginationContainer.appendChild(btn);
    }

    createPageButton("Sau →", currentPage < totalPages, () => {
        currentPage++;
        renderAccounts(filteredAccounts());
    });
};

// Lọc theo ô tìm kiếm
const filteredAccounts = () => {
    const keyword = searchInput.value.toLowerCase();
    return allAccounts.filter(a =>
        (a.fullName && a.fullName.toLowerCase().includes(keyword)) ||
        (a.code && a.code.toLowerCase().includes(keyword)) ||
        (a.email && a.email.toLowerCase().includes(keyword)) ||
        (a.username && a.username.toLowerCase().includes(keyword))
    );
};

// Gọi API lấy danh sách tài khoản
const fetchAccounts = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/user/findAll");
        const result = await res.json();
        allAccounts = result.data || [];

        currentPage = 1;
        renderAccounts(filteredAccounts());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderAccounts(filteredAccounts());
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách tài khoản:", err);
        accountTable.innerHTML = `<tr><td colspan="11" class="text-red-500 py-4">Không thể tải danh sách tài khoản</td></tr>`;
    }
};

// Xóa tài khoản
const handleDelete = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    if (role !== "ROLE_ADMIN") {
        alert("Bạn không có quyền xóa tài khoản này!");
        return;
    }
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/delete?code=${code}`, {
            method: 'PUT'
        });

        if (res.ok) {
            alert("Đã xóa tài khoản!");
            fetchAccounts();
        } else {
            alert("Xóa thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
        alert("Lỗi kết nối server!");
    }
};

// Ẩn tài khoản
const handleDisable = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?")) return;
    if (role !== "ROLE_ADMIN") {
        alert("Bạn không có quyền ẩn tài khoản này!");
        return;
    }
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/hidden?code=${code}`, {
            method: 'POST'
        });

        if (res.ok) {
            alert("Đã vô hiệu hóa tài khoản!");
            fetchAccounts();
        } else {
            alert("Vô hiệu hóa thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi vô hiệu hóa tài khoản:", error);
        alert("Lỗi kết nối server!");
    }
};

// Kích hoạt tài khoản
const handleActivate = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn kích hoạt tài khoản này?")) return;
    if (role !== "ROLE_ADMIN") {
        alert("Bạn không có quyền kích hoạt tài khoản này!");
        return;
    }
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/active?code=${code}`, {
            method: 'POST'
        });

        if (res.ok) {
            alert("Đã kích hoạt tài khoản!");
            fetchAccounts();
        } else {
            alert("Kích hoạt thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi kích hoạt tài khoản:", error);
        alert("Lỗi kết nối server!");
    }
};

window.addEventListener("DOMContentLoaded", fetchAccounts);
