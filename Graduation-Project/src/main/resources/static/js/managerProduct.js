const pageSize = 8;
let currentPage = 1;
let allProducts = [];

// Lấy các phần tử HTML
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

// Chuyển đổi mã loại thành tên
const getCategoryName = (type) => {
    switch (type) {
        case 1: return "Đồng hồ nam";
        case 2: return "Đồng hồ nữ";
        case 3: return "Phụ kiện";
        case 4: return "Treo tường";
        default: return "Không xác định";
    }
};

// Định dạng tiền
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hiển thị sản phẩm ra bảng theo trang
const renderProducts = (products) => {
    productTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

    paginatedProducts.forEach((product, index) => {
        const row = `
      <tr>
        <td class="px-4 py-2 border">${startIndex + index + 1}</td>
        <td class="px-4 py-2 border text-blue-600 hover:underline cursor-pointer">
          <a href="productManagerDetail.html?code=${product.code}">
            ${product.productName}
          </a>
        </td>
        <td class="px-4 py-2 border">${getCategoryName(product.productType)}</td>
        <td class="px-4 py-2 border">${product.brandName}</td>
        <td class="px-4 py-2 border">${product.discountName || "-"}</td>
        <td class="px-4 py-2 border">${formatCurrency(product.price)}</td>
        <td class="px-4 py-2 border">${formatCurrency(product.realPrice)}</td>
        <td class="px-4 py-2 border font-bold ${product.isDeleted ? 'text-red-500' : 'text-green-600'}">
                    ${product.isDeleted ? '❌' : '✅'}
                </td>
        <td class="px-4 py-2 border space-x-2">
          ${product.isDeleted
            ? `<button onclick="handleActivate('${product.code}')" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Kích hoạt</button>`
            : `<button onclick="handleHide('${product.code}')" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Vô hiệu hóa</button>`
        }
          <button onclick="handleDelete('${product.code}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Xóa</button>
        </td>
      </tr>
    `;
        productTable.innerHTML += row;
    });

    renderPagination(products.length);
};

// Hiển thị phân trang
const renderPagination = (totalItems) => {
    console.log("renderPagination được gọi với:", totalItems, "sản phẩm");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / pageSize);

    // Nút "Trước"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Trước";
    prevBtn.disabled = currentPage === 1;
    prevBtn.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts(filteredProducts());
        }
    });
    paginationContainer.appendChild(prevBtn);

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`;
        button.addEventListener("click", () => {
            currentPage = i;
            renderProducts(filteredProducts());
        });
        paginationContainer.appendChild(button);
    }

    // Nút "Sau"
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau →";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(filteredProducts());
        }
    });
    paginationContainer.appendChild(nextBtn);
};

const filteredProducts = () => {
    return allProducts.filter(p =>
        (p.productName || "").toLowerCase().includes(searchInput.value.toLowerCase())
    );
};

// Lấy dữ liệu từ API và render
const fetchProducts = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/products/getAll");
        const result = await res.json();
        allProducts = result.data || [];

        currentPage = 1; // Reset về trang đầu
        renderProducts(filteredProducts());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderProducts(filteredProducts());
        });
    } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        productTable.innerHTML = `<tr><td colspan="8" class="text-red-500 py-4">Không thể tải sản phẩm</td></tr>`;
    }

};

// Gọi API khi trang tải xong
window.addEventListener("DOMContentLoaded", fetchProducts);

const handleDelete = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/delete?code=${code}`, {
            method: 'PUT'
        });

        if (res.ok) {
            alert("Xóa sản phẩm thành công!");
            fetchProducts();
        } else {
            alert("Xóa thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Lỗi kết nối server!");
    }
};

const handleHide = async (code) => {
    if (!confirm("Bạn có muốn ẩn sản phẩm này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/hidden?code=${code}`, {
            method: 'POST'
        });

        if (res.ok) {
            alert("Sản phẩm đã được ẩn!");
            fetchProducts();
        } else {
            alert("Ẩn thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi ẩn sản phẩm:", error);
        alert("Lỗi kết nối server!");
    }
};

const handleActivate = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn kích hoạt lại mã giảm giá này?")) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/active?code=${code}`, {
            method: 'POST',
        });

        if (res.ok) {
            alert("Đã kích hoạt sản phẩm !");
            fetchProducts(); // Gọi lại để load danh sách mới
        } else {
            alert("Kích hoạt thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi kích hoạt sản phẩm:", error);
        alert("Lỗi kết nối server!");
    }
};
