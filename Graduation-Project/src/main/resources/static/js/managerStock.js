const pageSize = 8;
let currentPage = 1;
let allStocks = [];

const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date) ? "Không rõ" : date.toLocaleDateString('vi-VN');
}

// Lọc sản phẩm theo từ khóa
const filteredStocks = () => {
    const keyword = searchInput.value.toLowerCase();
    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

    return allStocks.filter(s => {
        const nameMatch =
            s.name.toLowerCase().includes(keyword) ||
            s.code.toLowerCase().includes(keyword) ||
            s.report.toLowerCase().includes(keyword);

        const importDate = new Date(s.importDate);
        importDate.setHours(0, 0, 0, 0); // Bỏ phần giờ để chuẩn hóa

        const startOK = !startDate || importDate >= new Date(startDate.setHours(0, 0, 0, 0));
        const endOK = !endDate || importDate <= new Date(endDate.setHours(23, 59, 59, 999));

        return nameMatch && startOK && endOK;
    });
};
[startDateInput, endDateInput].forEach(input => {
    input.addEventListener("change", () => {
        currentPage = 1;
        renderStocks(filteredStocks());
    });
});


// Render bảng sản phẩm
const renderStocks = (stocks) => {
    productTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedStocks = stocks.slice(startIndex, startIndex + pageSize);

    paginatedStocks.forEach((stock, index) => {
        const row = `
            <tr>
                <td class="px-4 py-2 border">${startIndex + index + 1}</td>
                <td class="px-4 py-2 border">${stock.report}</td>
                <td class="px-4 py-2 border">${stock.product}</td>
                <td class="px-4 py-2 border">${stock.name}</td> 
                <td class="px-4 py-2 border">${formatDate(stock.importDate)}</td>
                <td class="px-4 py-2 border">${stock.quantity}</td>
                <td class="px-4 py-2 border">${formatCurrency(stock.importPrice)}</td>
                <td class="px-4 py-2 border">${formatCurrency(stock.sellingPrice)}</td>
                <td class="px-4 py-2 border">${stock.note || ""}</td>
            </tr>
        `;
        productTable.innerHTML += row;
    });

    renderPagination(stocks.length);
};

// Render phân trang
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
        renderStocks(filteredStocks());
    });

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderStocks(filteredStocks());
        });
        paginationContainer.appendChild(btn);
    }

    createPageButton("Sau →", currentPage < totalPages, () => {
        currentPage++;
        renderStocks(filteredStocks());
    });
};

// Gọi API lấy dữ liệu kho
const fetchStocks = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/stock/findAll");
        const result = await res.json();
        allStocks = result.data || [];

        currentPage = 1;
        renderStocks(filteredStocks());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderStocks(filteredStocks());
        });
    } catch (err) {
        console.error("Lỗi khi lấy tồn kho:", err);
        productTable.innerHTML = `<tr><td colspan="7" class="text-red-500 py-4">Không thể tải dữ liệu tồn kho</td></tr>`;
    }
};

// Tự động gọi khi trang load xong
window.addEventListener("DOMContentLoaded", fetchStocks);
