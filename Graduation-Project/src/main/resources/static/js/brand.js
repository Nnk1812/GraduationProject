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
    .then(async data => {
        const container = document.querySelector("#findByBrand");
        container.innerHTML = "";
        const products = Array.isArray(data) ? data : data.data;

        if (Array.isArray(products)) {
            for (const product of products) {
                const { rating, ratingCount } = await fetchProductRating(product.code);
                const hasDiscount = product.discount && product.discount > 0;

                let starsHtml = '';
                if (rating > 0) {
                    const percentage = Math.min(Math.max(rating * 20, 0), 100);
                    starsHtml = `
                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                            <defs>
                                <linearGradient id="starGradient-${product.code}">
                                    <stop offset="${percentage}%" stop-color="#facc15" />
                                    <stop offset="${percentage}%" stop-color="#d1d5db" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#starGradient-${product.code})" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.882 
                            1.471 8.312L12 18.896l-7.407 4.604 1.471-8.312L0 
                            9.306l8.332-1.151z"/>
                        </svg>
                    `;
                }

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

                        <div class="flex items-center justify-between mt-3 text-sm text-gray-600 px-2">
                            ${rating > 0 ? `
                                <div class="flex items-center space-x-1">
                                    ${starsHtml}
                                    <span>(${rating.toFixed(1)})</span>
                                </div>
                            ` : '<div></div>'}
                            <div>Tồn kho: ${product.quantity}</div>
                        </div>

                        <a href="#" class="buy-now mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-500">Mua Ngay</a>
                    </div>
                `;

                container.insertAdjacentHTML("beforeend", html);

                const allBuyNowBtns = container.querySelectorAll(".buy-now");
                const currentBtn = allBuyNowBtns[allBuyNowBtns.length - 1];

                currentBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    const username = localStorage.getItem("username");
                    if (!username) {
                        alert("Vui lòng đăng nhập trước khi mua hàng.");
                        return;
                    }

                    fetch(`http://localhost:8080/DATN/cart/save?user=${username}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            product: product.code,
                            quantity: 1
                        })
                    })
                        .then(res => {
                            if (!res.ok) throw new Error("Không thể thêm vào giỏ hàng");
                            return res.json();
                        })
                        .then(data => {
                            console.log("Đã thêm vào giỏ hàng:", data);
                            window.location.href = "/DATN/pages/shoppingcart.html";
                        })
                        .catch(err => {
                            console.error("Lỗi:", err);
                            alert("Không thể thêm sản phẩm vào giỏ hàng.");
                        });
                });
            }

            addClickEvents();
        } else {
            console.error("Dữ liệu không đúng định dạng mảng:", data);
        }
    })
    .catch(error => {
        console.error("Lỗi khi fetch API:", error);
    });

// Hàm lưu sản phẩm vào localStorage
function saveProduct(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
}

// Gán sự kiện click để mở trang chi tiết
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

// Hàm fetch đánh giá từ API
async function fetchProductRating(productCode) {
    try {
        const res = await fetch(`http://localhost:8080/DATN/products/rating?code=${productCode}`);
        if (!res.ok) throw new Error('Failed to fetch rating');
        const result = await res.json();

        return {
            rating: result.data?.rating || 0,
            ratingCount: result.data?.ratingCount || 0
        };
    } catch (err) {
        console.error(`Lỗi lấy đánh giá cho sản phẩm ${productCode}:`, err);
        return { rating: 0, ratingCount: 0 };
    }
}
