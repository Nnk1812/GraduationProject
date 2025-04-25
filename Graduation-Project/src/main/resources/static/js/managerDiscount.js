const pageSize = 8;
let currentPage = 1;
let allDiscounts = [];

const discountTable = document.getElementById("discountTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Chuyển đổi loại giảm giá
const getDiscountTypeName = (type) => {
    switch (type) {
        case 1: return "Phần trăm";
        case 2: return "Tiền mặt";
        default: return "Không xác định";
    }
};

// Định dạng ngày
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

// Render các mã giảm giá ra bảng
const renderDiscounts = (discounts) => {
    discountTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedDiscounts = discounts.slice(startIndex, startIndex + pageSize);

    paginatedDiscounts.forEach((d, index) => {
        const row = `
            <tr>
                <td class="px-4 py-2 border">${startIndex + index + 1}</td> <!-- Số thứ tự -->
                <td class="px-4 py-2 border">
                    <a href="discountManagerDetail.html?code=${d.code}" class="text-blue-600 hover:underline">
                        ${d.name}
                    </a>
                </td>
                <td class="px-4 py-2 border">${d.code}</td>
                <td class="px-4 py-2 border font-bold ${d.isDeleted ? 'text-red-500' : 'text-green-600'}">
                    ${d.isDeleted ? '❌' : '✅'}
                </td>
                <td class="px-4 py-2 border">${formatDate(d.startDate)}</td>
                <td class="px-4 py-2 border">${formatDate(d.endDate)}</td>
                <td class="px-4 py-2 border">${getDiscountTypeName(d.type)}</td>
                <td class="px-4 py-2 border">${d.type === 1 ? `${d.value}%` : formatCurrency(d.value)}</td>
                
                <td class="px-4 py-2 border space-x-2">
                  <!-- Hiển thị nút "Kích hoạt" nếu mã giảm giá bị vô hiệu hóa -->
                    <!-- Hiển thị nút "Kích hoạt" nếu mã giảm giá bị vô hiệu hóa -->
                    ${d.isDeleted
                        ? `<button onclick="handleActivate('${d.code}')" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Kích hoạt</button>`
                        : `<button onclick="handleDisable('${d.code}')" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Vô hiệu hóa</button>`
                    }
                    <button onclick="handleDelete('${d.code}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Xóa</button>
                </td>
            </tr>
        `;
        discountTable.innerHTML += row;
    });

    renderPagination(discounts.length);
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
        renderDiscounts(filteredDiscounts());
    });

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderDiscounts(filteredDiscounts());
        });
        paginationContainer.appendChild(btn);
    }

    createPageButton("Sau →", currentPage < totalPages, () => {
        currentPage++;
        renderDiscounts(filteredDiscounts());
    });
};

// Lọc theo ô tìm kiếm
const filteredDiscounts = () => {
    const keyword = searchInput.value.toLowerCase();
    return allDiscounts.filter(d =>
        d.name.toLowerCase().includes(keyword) || d.code.toLowerCase().includes(keyword)
    );
};

// Gọi API lấy danh sách giảm giá
const fetchDiscounts = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/discount/findAll");
        const result = await res.json();
        allDiscounts = result.data || [];

        currentPage = 1;
        renderDiscounts(filteredDiscounts());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderDiscounts(filteredDiscounts());
        });
    } catch (err) {
        console.error("Lỗi khi lấy mã giảm giá:", err);
        discountTable.innerHTML = `<tr><td colspan="8" class="text-red-500 py-4">Không thể tải mã giảm giá</td></tr>`;
    }
};


// Xóa mã giảm giá
const handleDelete = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/discount/delete?code=${code}`, {
            method: 'PUT'
        });

        if (res.ok) {
            alert("Đã xóa mã giảm giá!");
            fetchDiscounts();
        } else {
            alert("Xóa thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa mã:", error);
        alert("Lỗi kết nối server!");
    }
};
const handleDisable = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/discount/hidden?code=${code}`, {
            method: 'POST'
        });

        if (res.ok) {
            alert("Đã vô hiệu hóa mã giảm giá!");
            fetchDiscounts();
        } else {
            alert("Vô hiệu hóa thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi vô hiệu hóa mã:", error);
        alert("Lỗi kết nối server!");
    }
};

const handleActivate = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn kích hoạt lại mã giảm giá này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/discount/active?code=${code}`, {
            method: 'POST',
        });

        if (res.ok) {
            alert("Đã kích hoạt mã giảm giá!");
            fetchDiscounts(); // Gọi lại để load danh sách mới
        } else {
            alert("Kích hoạt thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi kích hoạt mã:", error);
        alert("Lỗi kết nối server!");
    }
};


// Gọi khi trang tải xong
window.addEventListener("DOMContentLoaded", fetchDiscounts);
