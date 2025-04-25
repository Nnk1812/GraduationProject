// Lấy thông số thương hiệu từ URL
const urlParams = new URLSearchParams(window.location.search);
const brand = urlParams.get('brand');

// Hiển thị tiêu đề và thương hiệu sản phẩm
if (brand) {
    document.getElementById("brand-title").innerText = `Sản phẩm của thương hiệu ${brand}`;
    document.getElementById("brand-section").classList.remove("hidden");
}
fetch(`http://localhost:8080/DATN/products/findByBrand?brand=${brand}`)
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector("#findByBrand");
        container.innerHTML = "";
        // Nếu API trả về object có dạng { data: [...] }
        const products = Array.isArray(data) ? data : data.data;
        if (Array.isArray(products)) {
            products.forEach(product => {
                const hasDiscount = product.discount && product.discount > 0;
                const html = `
                        <div class="product bg-white p-4 shadow-md rounded-lg text-center relative">
            <a href="productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>

                <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg">
            </a>
            <a href="productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>

                <h3 class="text-xl font-semibold mt-4 hover:underline">${product.name}</h3>
            </a>


               <div class="mt-2">
                            <span class="${hasDiscount ? 'text-red-600' : 'text-black'} text-2xl font-bold">
                                ${hasDiscount ? product.realPrice.toLocaleString() : product.price.toLocaleString()}₫
                            </span>
                        </div>

                        ${hasDiscount ? `
                        <div class="flex items-center justify-center space-x-2 mt-1">
                            <span class="line-through text-gray-500 text-base">
                                ${product.price.toLocaleString()}₫
                            </span>
                            <span class="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                                -${product.discount}%
                            </span>
                        </div>
                        ` : ''}
            <a href="#" class="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-500">Mua Ngay</a>
        </div>

            `;

                container.insertAdjacentHTML("beforeend", html);
            });
            addClickEvents();
        } else {
            console.error("Dữ liệu không đúng định dạng mảng:", data);
        }
    })
    .catch(error => {
        console.error("Lỗi khi fetch API:", error);
    });

function saveProduct(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
}
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