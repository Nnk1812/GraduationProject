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
function renderAverageStars(avgRating) {
    const maxStars = 5;
    const fullStars = Math.floor(avgRating);
    const halfStar = avgRating % 1 >= 0.5;
    let starsHtml = '';

    for (let i = 1; i <= maxStars; i++) {
        if (i <= fullStars) {
            starsHtml += `<i class="fas fa-star text-yellow-500"></i>`;
        } else if (i === fullStars + 1 && halfStar) {
            starsHtml += `<i class="fas fa-star-half-alt text-yellow-500"></i>`;
        } else {
            starsHtml += `<i class="far fa-star text-gray-300"></i>`;
        }
    }

    return starsHtml;
}
async function fetchAndRenderReviews() {
    try {
        const response = await fetch(`http://localhost:8080/DATN/products/findAllReview?code=${product.code}`);
        const result = await response.json();

        if (result.code !== 200 || !Array.isArray(result.data)) {
            throw new Error("Dữ liệu đánh giá không hợp lệ.");
        }

        const reviews = result.data;
        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1) : '0.0';

        // Cập nhật tổng đánh giá
        document.getElementById("average-rating").innerText = avgRating;
        document.getElementById("total-reviews").innerText = `(${totalReviews} đánh giá)`;

        // Render sao trung bình
        document.getElementById("average-stars").innerHTML = renderAverageStars(parseFloat(avgRating));

        // Render danh sách đánh giá
        const listContainer = document.getElementById("review-list");
        listContainer.innerHTML = ""; // Xóa cũ

        reviews.forEach(review => {
            const createdDate = new Date(review.created_at).toLocaleDateString('vi-VN');
            const stars = renderAverageStars(review.rating);

            const reviewHTML = `
                <div class="border-t pt-4">
                    <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center space-x-2">
                            <p class="font-medium text-gray-800">${review.user}</p>
                        </div>
                    </div>
                    <div class="flex items-center text-yellow-400 text-base mb-1">
                        ${stars}
                    </div>
                    <p class="text-gray-700 mb-2">${review.comment}</p>
                    <p class="text-sm text-gray-500">${createdDate}</p>
                </div>
            `;
            listContainer.insertAdjacentHTML("beforeend", reviewHTML);
        });

    } catch (error) {
        console.error("Lỗi khi tải đánh giá:", error);
    }
}


// Gọi hàm khi tải trang (ví dụ với code = 'P002')
document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderReviews();
});