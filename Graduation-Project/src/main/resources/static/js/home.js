fetch("http://localhost:8080/DATN/products/findOutstanding")
    .then(response => response.json())
    .then(data => {
        const container = document.querySelector("#outstanding-products");
        container.innerHTML = "";

        const products = Array.isArray(data) ? data : data.data;

        if (Array.isArray(products)) {
            products.forEach(product => {
                const html = `
                    <div class="product bg-white p-4 shadow-md rounded-lg text-center relative">
                        <a href="/DATN/pages/productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>
                            <img src="${product.img}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg">
                        </a>
                        <a href="/DATN/pages/productDetail.html" class="product-link" data-product='${JSON.stringify(product)}'>
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
                        <a href="#" class="buy-now mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-full text-lg hover:bg-blue-500">Mua Ngay</a>
                    </div>`;

                container.insertAdjacentHTML("beforeend", html);

                // Gắn sự kiện click cho nút "Mua Ngay" vừa thêm
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
            });
            addClickEvents();
        } else {
            console.error("Dữ liệu không đúng định dạng mảng:", data);
        }
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
            window.location.href = "/DATN/pages/productDetail.html";
        });
    });
}

