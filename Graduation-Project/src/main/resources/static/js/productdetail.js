const product = JSON.parse(localStorage.getItem("selectedProduct"));
console.log(product);
if (product) {
    // Gán dữ liệu vào HTML
    const nameEl = document.getElementById("productName");
    if (nameEl) nameEl.textContent = product.name;

    const imgEl = document.getElementById("product-img");
    if (imgEl) {
        imgEl.src = product.img;
        imgEl.alt = product.name;
    }

    const brandEl = document.getElementById("brand-name");
    if (brandEl) {
        // Lấy tên nhãn hàng từ API
        fetch(`http://localhost:8080/DATN/brand/findName?code=${product.brand}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    // Gán tên nhãn hàng vào phần tử brand-name
                    brandEl.textContent = data.data || "Chưa có nhãn hàng";
                    brandEl.href = `brand.html?brand=${data.data}`;
                } else {
                    brandEl.textContent = "Chưa có nhãn hàng";
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy tên nhãn hàng:", error);
                brandEl.textContent = "Không thể lấy tên nhãn hàng";
            });
    }
    const priceEl = document.querySelector(".text-red-600.text-3xl, .text-black.text-3xl");
    const oldPriceEl = document.querySelector(".line-through.text-gray-500");
    const discountEl = document.querySelector(".bg-red-100.text-red-600");
    const descriptionEl = document.getElementById("description");

    document.getElementById("product-name").textContent = product.name;

    // Kiểm tra giảm giá
    if (product.discount && product.discount > 0) {
        if (priceEl) {
            priceEl.textContent = `${product.realPrice.toLocaleString()}₫`;
            priceEl.classList.remove("text-black");
            priceEl.classList.add("text-red-600");
        }
        if (oldPriceEl) {
            oldPriceEl.textContent = `${product.price.toLocaleString()}₫`;
            oldPriceEl.style.display = "inline";
        }
        if (discountEl) {
            discountEl.textContent = `-${product.discount}%`;
            discountEl.style.display = "inline-block";
        }
    } else {
        if (priceEl) {
            priceEl.textContent = `${product.price.toLocaleString()}₫`;
            priceEl.classList.remove("text-red-600");
            priceEl.classList.add("text-black");
        }
        if (oldPriceEl) oldPriceEl.style.display = "none";
        if (discountEl) discountEl.style.display = "none";
    }

    if (descriptionEl) descriptionEl.textContent = product.description || "Không có mô tả.";

    fetch(`http://localhost:8080/DATN/products/productDetail?code=${product.code}`)
        .then(res => res.json())
        .then(detail => {
            const response = detail.data;
            document.getElementById("material").textContent = response.material || "Không rõ";
            document.getElementById("strapMaterial").textContent = response.strapMaterial || "Không rõ";
            document.getElementById("movementType").textContent = response.movementType || "Không rõ";
            document.getElementById("waterResistance").textContent = response.waterResistance || "Không rõ";
            document.getElementById("dialSize").textContent = response.dialSize || "Không rõ";
            document.getElementById("origin").textContent = response.origin || "Không rõ";
        })
        .catch(error => {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            document.getElementById("product-name").textContent = "Lỗi không lấy được thông tin sản phẩm";
        });
} else {
    document.getElementById("product-name").textContent = "Không có sản phẩm";
}

// Mua hàng
document.getElementById("order").addEventListener("click", function () {
    const username = localStorage.getItem("username");
    const payload = {
        product: product.code,
        quantity: 1
    };

    fetch(`http://localhost:8080/DATN/cart/save?user=${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Gửi dữ liệu thất bại");
            }
            return response.json();
        })
        .then(data => {
            console.log("Thêm vào giỏ hàng thành công:", data);
            window.location.href = "/DATN/pages/shoppingcart.html";
        })
        .catch(error => {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            alert("Không thể thêm sản phẩm vào giỏ. Vui lòng thử lại.");
        });
});
