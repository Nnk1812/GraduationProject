const params = new URLSearchParams(window.location.search);
const type = params.get('type');

const typeMap = {
    nam: 1,
    nu: 2,
    phukien: 3,
    treotuong: 4
};

const titleMap = {
    nam: 'Đồng hồ dành cho nam',
    nu: 'Đồng hồ dành cho nữ',
    phukien: 'Các sản phẩm phụ kiện',
    treotuong: 'Đồng hồ treo tường'
};

// Gán tiêu đề
const h1 = document.createElement('h1');
h1.id = 'product-title';
h1.className = 'text-3xl font-bold mb-10 text-blue-900 text-center';
h1.textContent = titleMap[type] || 'Tất cả sản phẩm';

const section = document.querySelector("section");
section.parentNode.insertBefore(h1, section);

// Gọi API sản phẩm và xử lý
fetch('http://localhost:8080/DATN/products/findAll')
    .then(response => response.json())
    .then(async data => {
        const container = document.querySelector("#findByType");
        container.innerHTML = "";

        const products = Array.isArray(data) ? data : data.data;
        const filterType = typeMap[type];
        const filteredProducts = filterType
            ? products.filter(product => Number(product.type) === filterType)
            : products;

        if (filteredProducts.length === 0) {
            container.innerHTML = "<p class='text-center col-span-full text-gray-500'>Không có sản phẩm nào.</p>";
            return;
        }

        for (const product of filteredProducts) {
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
<div class="product bg-white p-4 shadow-md rounded-lg flex flex-col text-center relative">
  <!-- Gói toàn bộ phần trên rating vào đây -->
  <div class="flex flex-col items-center justify-start h-[360px]">
    <a href="productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>
      <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg">
    </a>
    <a href="productDetail.html" class="product-link mt-2" data-product='${JSON.stringify(product)}'>
      <h3 class="text-xl font-semibold hover:underline line-clamp-2 leading-tight">
        ${product.name}
      </h3>
    </a>

    <!-- Giá và giảm giá -->
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

  <!-- Phần đánh giá và nút -->
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


</div>

        `;

            container.insertAdjacentHTML("beforeend", html);

            const allBuyNowBtns = container.querySelectorAll(".buy-now");
            const currentBtn = allBuyNowBtns[allBuyNowBtns.length - 1];

            currentBtn.addEventListener("click", function (e) {
                e.preventDefault();
                const username = localStorage.getItem("username");
                if (!username) {
                    Swal.fire({
                        icon: 'warning',
                        text: 'Vui lòng đăng nhập trước khi mua hàng',
                    });
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
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể thêm sản phẩm vào giỏ hàng',
                        });
                    });
            });
        }

        addClickEvents();
    })
    .catch(error => {
        console.error("Lỗi khi fetch API:", error);
    });

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
