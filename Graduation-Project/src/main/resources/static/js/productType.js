const params = new URLSearchParams(window.location.search);
const type = params.get('type');

const typeMap = {
    nam: 1,
    nu: 2,
    phukien: 3,
    treotuong: 4
};

// Tiêu đề hiển thị
const titleMap = {
    nam: 'Đồng hồ dành cho nam',
    nu: 'Đồng hồ dành cho nữ',
    phukien: 'Các sản phẩm phụ kiện',
    treotuong: 'Đồng hồ treo tường'
};

// Gán tiêu đề
// Tạo thẻ h1 với tiêu đề từ titleMap
const h1 = document.createElement('h1');
h1.id = 'product-title';
h1.className = 'text-3xl font-bold mb-10 text-blue-900 text-center';
h1.textContent = titleMap[type] || 'Tất cả sản phẩm';

// Thêm thẻ h1 vào DOM, ngay trước section
const section = document.querySelector("section");
section.parentNode.insertBefore(h1, section);

// Gọi API và lọc theo type
fetch('http://localhost:8080/DATN/products/findAll')
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector("#findByType");
        container.innerHTML = "";

        const products = Array.isArray(data) ? data : data.data;

        // Lọc sản phẩm theo type nếu có
        const filterType = typeMap[type];
        const filteredProducts = filterType
            ? products.filter(product => Number(product.type) === filterType)
            : products;
        console.log("Sản phẩm sau khi lọc:", filteredProducts);
        // Hiển thị sản phẩm
        if (filteredProducts.length === 0) {
            container.innerHTML = "<p class='text-center col-span-full text-gray-500'>Không có sản phẩm nào.</p>";
            return;
        }

        filteredProducts.forEach(product => {
            const html = `
                <div class="product bg-white p-4 shadow-md rounded-lg text-center relative">
                    <a href="productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>
                        <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg">
                    </a>
                    <a href="productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>
                        <h3 class="text-xl font-semibold mt-4 hover:underline">${product.name}</h3>
                    </a>

                    <div class="mt-2">
                        <span class="text-red-600 text-2xl font-bold">
                            ${product.realPrice.toLocaleString()}₫
                        </span>
                    </div>

                    <div class="flex items-center justify-center space-x-2 mt-1">
                        <span class="line-through text-gray-500 text-base">
                            ${product.price.toLocaleString()}₫
                        </span>
                        <span class="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                            -${product.discount}%
                        </span>
                    </div>

                    <a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-500">Mua Ngay</a>
                </div>`;
            container.insertAdjacentHTML("beforeend", html);
        });
        addClickEvents();
    })
    .catch(error => {
        console.error("Lỗi khi fetch API:", error);
    });

function addClickEvents() {
    document.querySelectorAll(".product-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const product = JSON.parse(this.dataset.product);
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "productDetail.html";
        });
    });
}