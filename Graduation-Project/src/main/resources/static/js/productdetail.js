const product = JSON.parse(localStorage.getItem("selectedProduct"));
console.log(localStorage.getItem("selectedProduct"));

if (product) {
    // Gán dữ liệu vào HTML
    const nameEl = document.getElementById("productName");
    if (nameEl) nameEl.textContent = product.name;
    const imgEl = document.getElementById("product-img");
    if (imgEl) {
        imgEl.src = product.img;
        imgEl.alt = product.name;
    }
    const priceEl = document.querySelector(".text-red-600.text-3xl");
    const oldPriceEl = document.querySelector(".line-through.text-gray-500");
    const discountEl = document.querySelector(".bg-red-100.text-red-600");
    const descriptionEl = document.getElementById("description");

    document.getElementById("product-name").textContent = product.name ;
    if (priceEl) priceEl.textContent = `${product.realPrice.toLocaleString()}₫`;
    if (oldPriceEl) oldPriceEl.textContent = `${product.price.toLocaleString()}₫`;
    if (discountEl) discountEl.textContent = `-${product.discount}%`;
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
            document.getElementById("product-name").textContent = "Lỗi không lấy được thông tin sản phẩm" ;
        });
} else {
    // Nếu không có sản phẩm, có thể redirect hoặc hiển thị thông báo
    document.getElementById("product-name").textContent = "Không có sản phẩm" ;
}

    //mua hàng

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


