// Chuyển đổi trạng thái phiếu nhập kho
const convertImportStatus = (status) => {
    switch (status) {
        case 1: return "Đang tạo phiếu nhập kho";
        case 2: return "Kiểm tra sản phẩm";
        case 3: return "Hoàn thành phiếu nhập kho";
        default: return "Không xác định";
    }
};

const pageSize = 8;
let currentPage = 1;
let allReports = [];

// Lấy các phần tử HTML
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

// Định dạng tiền
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hiển thị phiếu nhập kho ra bảng theo trang
const renderReports = (reports) => {
    productTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedReports = reports.slice(startIndex, startIndex + pageSize);

    paginatedReports.forEach((report, index) => {
        const row = `
      <tr>
        <td class="px-4 py-2 border">${startIndex + index + 1}</td>
        <td class="px-4 py-2 border text-blue-600 hover:underline cursor-pointer">
          <a href="warehouseImportProduct.html?code=${report.code}">
            ${report.name}
          </a>
        </td>
        <td class="px-4 py-2 border">${report.code}</td>
        <td class="px-4 py-2 border">${new Date(report.importDate).toLocaleDateString('vi-VN')}</td>
        <td class="px-4 py-2 border">${report.employee}</td>
        <td class="px-4 py-2 border">${convertImportStatus(report.status)}</td>
        <td class="px-4 py-2 border">${report.discount || "-"}</td>
        <td class="px-4 py-2 border">${formatCurrency(report.price)}</td>
        <td class="px-4 py-2 border">${formatCurrency(report.realPrice)}</td>
        <td class="px-4 py-2 border">${report.note || ""}</td>
      </tr>
    `;
        productTable.innerHTML += row;
    });

    renderPagination(reports.length);
};

// Hiển thị phân trang
const renderPagination = (totalItems) => {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / pageSize);

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Trước";
    prevBtn.disabled = currentPage === 1;
    prevBtn.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderReports(filterReports());
        }
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`;
        button.addEventListener("click", () => {
            currentPage = i;
            renderReports(filterReports());
        });
        paginationContainer.appendChild(button);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau →";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderReports(filterReports());
        }
    });
    paginationContainer.appendChild(nextBtn);
};

// Lọc dữ liệu theo ô tìm kiếm
const filterReports = () => {
    return allReports.filter(r =>
        (r.name || "").toLowerCase().includes(searchInput.value.toLowerCase()) ||
        (r.code || "").toLowerCase().includes(searchInput.value.toLowerCase())
    );
};

// Gọi API lấy dữ liệu phiếu nhập kho
const fetchReports = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/warehouse/findAll");
        const result = await res.json();
        allReports = result.data || [];

        currentPage = 1;
        renderReports(filterReports());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderReports(filterReports());
        });
    } catch (err) {
        console.error("Lỗi khi tải phiếu nhập kho:", err);
        productTable.innerHTML = `<tr><td colspan="11" class="text-red-500 py-4">Không thể tải phiếu nhập kho</td></tr>`;
    }
};

// Khởi chạy khi trang tải xong
window.addEventListener("DOMContentLoaded", fetchReports);
