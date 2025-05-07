const pageSize = 8;
let currentPage = 1;
let allBrands = [];

const brandTable = document.getElementById("brandTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

// Định dạng ngày (nếu bạn cần)
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

// Render nhãn hàng ra bảng
const renderBrands = (brands) => {
    brandTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedBrands = brands.slice(startIndex, startIndex + pageSize);

    paginatedBrands.forEach((b, index) => {
        const row = `
            <tr>
                <td class="px-4 py-2 border">${startIndex + index + 1}</td>
                <td class="px-4 py-2 border">
                    <a href="brandManagerDetail.html?code=${b.code}" class="text-blue-600 hover:underline">
                        ${b.name}
                    </a>
                </td>
                <td class="px-4 py-2 border">${b.code}</td>
                <td class="px-4 py-2 border">${b.email || ""}</td>
                <td class="px-4 py-2 border">${b.address || ""}</td>
                <td class="px-4 py-2 border">${b.phone || ""}</td>
                <td class="px-4 py-2 border space-x-2">
                    <button onclick="handleDelete('${b.code}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Xóa</button>
                </td>
            </tr>
        `;
        brandTable.innerHTML += row;
    });

    renderPagination(brands.length);
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
        renderBrands(filteredBrands());
    });

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderBrands(filteredBrands());
        });
        paginationContainer.appendChild(btn);
    }

    createPageButton("Sau →", currentPage < totalPages, () => {
        currentPage++;
        renderBrands(filteredBrands());
    });
};

// Lọc theo ô tìm kiếm
const filteredBrands = () => {
    const keyword = searchInput.value.toLowerCase();
    return allBrands.filter(b =>
        b.name.toLowerCase().includes(keyword) || b.code.toLowerCase().includes(keyword)
    );
};

// Gọi API lấy danh sách nhãn hàng
const fetchBrands = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/brand/findAll");
        const result = await res.json();
        allBrands = result.data || [];

        currentPage = 1;
        renderBrands(filteredBrands());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderBrands(filteredBrands());
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách nhãn hàng:", err);
        brandTable.innerHTML = `<tr><td colspan="8" class="text-red-500 py-4">Không thể tải danh sách nhãn hàng</td></tr>`;
    }
};

// Xóa nhãn hàng
const handleDelete = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhãn hàng này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/brand/delete?code=${code}`, {
            method: 'PUT'
        });

        if (res.ok) {
            alert("Đã xóa nhãn hàng!");
            fetchBrands();
        } else {
            alert("Xóa thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa nhãn hàng:", error);
        alert("Lỗi kết nối server!");
    }
};

// Gọi khi trang tải xong
window.addEventListener("DOMContentLoaded", fetchBrands);
