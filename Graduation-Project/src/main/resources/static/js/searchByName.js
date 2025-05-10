document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                const keyword = searchInput.value.trim().toLowerCase();
                if (keyword) {
                    const newUrl = `/DATN/pages/searchByName.html?name=${encodeURIComponent(keyword)}`;
                    const currentUrl = window.location.pathname + window.location.search;
                    if (currentUrl === newUrl) {
                        window.location.reload();
                    } else {
                        window.location.href = newUrl;
                    }
                }
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const productContainer = document.getElementById("findAll");

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("name");
    const searchInfoDiv = document.getElementById("searchInfo");
    if (searchInfoDiv && keyword) {
        searchInfoDiv.textContent = `Kết quả tìm kiếm cho: "${keyword}"`;
    }

    if (keyword) {
        fetch(`http://localhost:8080/DATN/products/findByName?name=${encodeURIComponent(keyword)}`)
            .then(response => {
                if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
                return response.json();
            })
            .then(async data => {
                productContainer.innerHTML = "";

                const products = Array.isArray(data.data) ? data.data : [];
                if (products.length === 0) {
                    productContainer.innerHTML = '<p class="col-span-4 text-red-500">Không tìm thấy sản phẩm nào.</p>';
                    return;
                }

                for (const product of products) {
                    const { rating, ratingCount } = await fetchProductRating(product.code);
                    const hasDiscount = !!product.discount;

                    const percentage = Math.min(Math.max(rating * 20, 0), 100);
                    const gradientId = `starGradient-${product.code}`;
                    const starsHtml = rating > 0 ? `
                        <svg class="w-6 h-6" viewBox="0 0 24 24">
                            <defs>
                                <linearGradient id="${gradientId}">
                                    <stop offset="${percentage}%" stop-color="#facc15" />
                                    <stop offset="${percentage}%" stop-color="#d1d5db" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#${gradientId})" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.882 
                            1.471 8.312L12 18.896l-7.407 4.604 1.471-8.312L0 
                            9.306l8.332-1.151z"/>
                        </svg>
                    ` : '';

                    const html = `
<div class="product bg-white p-4 shadow-md rounded-lg flex flex-col text-center relative">
  <div class="flex flex-col items-center justify-start h-[360px]">
    <a href="productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>
      <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg">
    </a>
    <a href="productDetail.html" class="product-link mt-2" data-product='${JSON.stringify(product)}'>
      <h3 class="text-xl font-semibold hover:underline line-clamp-2 leading-tight">
        ${product.name}
      </h3>
    </a>
    <div class="h-16 flex flex-col justify-center items-center mt-2">
      <span class="${hasDiscount ? 'text-red-600' : 'text-black'} text-2xl font-bold">
        ${hasDiscount ? product.realPrice.toLocaleString() : product.price.toLocaleString()}₫
      </span>
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
    </div>
  </div>

  <div class="flex flex-col mt-4 h-full justify-between">
    <div class="flex items-center justify-between mb-2">
      ${rating > 0 ? `
        <div class="flex items-center space-x-2">
          ${starsHtml}
          <span class="text-gray-600 text-sm">(${rating.toFixed(1)})</span>
        </div>
      ` : '<div></div>'}
      <div class="text-sm text-gray-600">Tồn kho: ${product.quantity}</div>
    </div>
    ${product.realPrice <= 20000000 ? `
        <a href="#" class="buy-now bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-500 mt-auto">Mua Ngay</a>
    ` : ''}
  </div>
</div>
                    `;

                    productContainer.insertAdjacentHTML("beforeend", html);

                    const allBuyNowBtns = productContainer.querySelectorAll(".buy-now");
                    const currentBtn = allBuyNowBtns[allBuyNowBtns.length - 1];

                    currentBtn.addEventListener("click", function (e) {
                        e.preventDefault();

                        const username = localStorage.getItem("username");
                        if (!username) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Chưa đăng nhập',
                                text: 'Vui lòng đăng nhập trước khi mua hàng.'
                            });
                            return;
                        }

                        fetch(`http://localhost:8080/DATN/cart/save?user=${username}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
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
                                window.location.href = "/DATN/pages/shoppingcart.html";
                            })
                            .catch(err => {
                                console.error("Lỗi:", err);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi',
                                    text: 'Không thể thêm sản phẩm vào giỏ hàng.'
                                });
                            });
                    });
                }

                addClickEvents();
            })
            .catch(error => {
                console.error('Lỗi API:', error);
                productContainer.innerHTML = '<p class="col-span-4 text-red-500">Lỗi khi tải dữ liệu.</p>';
            });
    }

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

    function addClickEvents() {
        document.querySelectorAll(".product-link").forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const product = JSON.parse(this.dataset.product);
                localStorage.setItem("selectedProduct", JSON.stringify(product));
                const newUrl = `/DATN/pages/searchByName.html?name=${encodeURIComponent(keyword)}`;
                if (window.location.href === window.location.origin + newUrl) {
                    window.location.reload();
                } else {
                    window.location.href = newUrl;
                }
            });
        });
    }
});
let allProductNames = [];


fetch('http://localhost:8080/DATN/products/getAllNames')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        allProductNames = Array.isArray(data) ? data : [];
    });

const input = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

input.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    console.log("Input value:", value);
    suggestions.innerHTML = "";

    if (!value) {
        suggestions.classList.add("hidden");
        return;
    }

    const filtered = allProductNames.filter(name =>
        name.toLowerCase().includes(value)
    ).slice(0, 10);

    if (filtered.length === 0) {
        suggestions.classList.add("hidden");
        return;
    }

    filtered.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        li.className = "p-2 hover:bg-gray-200 cursor-pointer";
        li.addEventListener("click", () => {
            input.value = name;
            suggestions.classList.add("hidden");
            window.location.href = `/DATN/pages/searchByName.html?name=${encodeURIComponent(name)}`;
        });
        suggestions.appendChild(li);
    });

    suggestions.classList.remove("hidden");
});
