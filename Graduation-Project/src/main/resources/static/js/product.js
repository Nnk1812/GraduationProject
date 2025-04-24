const PRODUCTS_PER_PAGE = 12;
let currentPage = 1;
let products = [];

function renderProducts(page) {
    const container = document.querySelector("#findAll");
    container.innerHTML = "";

    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
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
        </div>

            `;
        container.insertAdjacentHTML("beforeend", html);
    });
    addClickEvents();
}
function saveProduct(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
}

function renderPagination() {
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    const createButton = (text, page, isActive = false) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = `px-3 py-1 rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white'}`;
        btn.onclick = () => {
            currentPage = page;
            renderProducts(currentPage);
            renderPagination();
        };
        return btn;
    };

    // Nút Trước
    if (currentPage > 1) {
        pagination.appendChild(createButton("«", currentPage - 1));
    }

    for (let i = 1; i <= totalPages; i++) {
        pagination.appendChild(createButton(i, i, i === currentPage));
    }

    // Nút Sau
    if (currentPage < totalPages) {
        pagination.appendChild(createButton("»", currentPage + 1));
    }
}

// Gọi API và khởi tạo lần đầu
fetch("http://localhost:8080/DATN/products/findAll")
    .then(response => response.json())
    .then(data => {
        products = Array.isArray(data) ? data : data.data || [];
        renderProducts(currentPage);
        renderPagination();
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
