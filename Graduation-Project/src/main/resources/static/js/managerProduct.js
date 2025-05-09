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
        const statusClass = product.isDeleted ? 'text-red-500' : 'text-green-600';
        const statusText = product.isDeleted ? '❌' : '✅';

        const actionButtons = `
  <div class="flex justify-center items-center gap-2">
      ${product.isDeleted
            ? `<button onclick="handleActivate('${product.code}')" 
                      class="bg-green-500 text-white px-3 py-1 rounded font-semibold w-24 hover:bg-green-600">
                  Kích hoạt
             </button>`
            : `<button onclick="handleHide('${product.code}')" 
                      class="bg-yellow-400 text-black px-3 py-1 rounded font-semibold w-24 hover:bg-yellow-500">
                  Vô hiệu hóa
             </button>`
        }
      <button onclick="handleDelete('${product.code}')" 
              class="bg-red-600 text-white px-3 py-1 rounded font-semibold w-24 hover:bg-red-700">
          Xóa
      </button>
  </div>
`;



        const row = `
            <tr>
                <td class="px-4 py-2 border text-center">${startIndex + index + 1}</td>
                <td class="px-4 py-2 border text-center">${product.code}</td>
                <td class="px-4 py-2 border text-blue-600 hover:underline text-center">
                    <a href="productManagerDetail.html?code=${product.code}">
                        ${product.productName}
                    </a>
                </td>
                <td class="px-4 py-2 border text-center">${getCategoryName(product.productType)}</td>
                <td class="px-4 py-2 border text-center">${product.brandName}</td>
                <td class="px-4 py-2 border text-center">${product.discountName || "-"}</td>
                <td class="px-4 py-2 border text-center">${formatCurrency(product.price)}</td>
                <td class="px-4 py-2 border text-center">${formatCurrency(product.realPrice)}</td>
                <td class="px-4 py-2 border font-bold text-center ${statusClass}">${statusText}</td>
                <td class="px-4 py-2 border">${actionButtons}</td>
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

const confirmAction = async ({ title, text, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true
    });
    return result.isConfirmed;
};
// Xóa sản phẩm
const handleDelete = async (code) => {
    const confirmed = await confirmAction({
        title: 'Xóa sản phẩm',
        text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        confirmText: 'Xóa'
    });

    if (!confirmed) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/delete?code=${code}`, { method: 'PUT' });
        if (res.ok) {
            Swal.fire('Thành công', 'Đã xóa sản phẩm!', 'success');
            fetchProducts();
        } else {
            Swal.fire('Lỗi', 'Product in the order cannot be delete', 'error');
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
    }
};

// Ẩn sản phẩm
const handleHide = async (code) => {
    const confirmed = await confirmAction({
        title: 'Ẩn sản phẩm',
        text: 'Bạn có muốn ẩn sản phẩm này?',
        confirmText: 'Ẩn'
    });

    if (!confirmed) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/hidden?code=${code}`, { method: 'POST' });
        if (res.ok) {
            Swal.fire('Thành công', 'Đã ẩn sản phẩm!', 'success');
            fetchProducts();
        } else {
            Swal.fire('Lỗi', 'Product in the order cannot be hidden', 'error');
        }
    } catch (error) {
        console.error("Lỗi khi ẩn sản phẩm:", error);
        Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
    }
};

// Kích hoạt sản phẩm
const handleActivate = async (code) => {
    const confirmed = await confirmAction({
        title: 'Kích hoạt sản phẩm',
        text: 'Bạn có chắc chắn muốn kích hoạt lại mã giảm giá này?',
        confirmText: 'Kích hoạt'
    });

    if (!confirmed) return;

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/active?code=${code}`, { method: 'POST' });
        if (res.ok) {
            Swal.fire('Thành công', 'Kích hoạt sản phẩm thành công!', 'success');
            fetchProducts();
        } else {
            Swal.fire('Lỗi', 'Kích hoạt sản phẩm thất bại!', 'error');
        }
    } catch (error) {
        console.error("Lỗi khi kích hoạt sản phẩm:", error);
        Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
    }
};

