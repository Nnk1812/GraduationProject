const provinceSelect = document.getElementById("province-select");
const districtSelect = document.getElementById("district-select");
const wardSelect = document.getElementById("ward-select");
const username = localStorage.getItem("username");
// Tải tỉnh/thành
fetch("https://provinces.open-api.vn/api/?depth=1")
    .then(res => res.json())
    .then(data => {
        data.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.code;
            opt.textContent = item.name;
            provinceSelect.appendChild(opt);
        });
    });

// Khi chọn tỉnh
provinceSelect.addEventListener("change", () => {
    const code = provinceSelect.value;
    districtSelect.innerHTML = `<option value="">Chọn quận/huyện</option>`;
    wardSelect.innerHTML = `<option value="">Chọn phường/xã</option>`;
    wardSelect.disabled = true;

    if (!code) return districtSelect.disabled = true;

    fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then(res => res.json())
        .then(data => {
            districtSelect.disabled = false;
            data.districts.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d.code;
                opt.textContent = d.name;
                districtSelect.appendChild(opt);
            });
        });
});

// Khi chọn quận
districtSelect.addEventListener("change", () => {
    const code = districtSelect.value;
    wardSelect.innerHTML = `<option value="">Chọn phường/xã</option>`;

    if (!code) return wardSelect.disabled = true;

    fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then(res => res.json())
        .then(data => {
            wardSelect.disabled = false;
            data.wards.forEach(w => {
                const opt = document.createElement("option");
                opt.value = w.code;
                opt.textContent = w.name;
                wardSelect.appendChild(opt);
            });
        });
});

// hiển thị thông tin sản phẩm

    document.addEventListener("DOMContentLoaded", function () {


    fetch(`http://localhost:8080/DATN/cart/findAll?user=${username}`)
        .then(response => response.json())
        .then(result => {
            const data = result.data;
            if (!Array.isArray(data)) {
                console.error("Dữ liệu không hợp lệ:", data);
                return;
            }
            const cartItems = data.map(item => ({
                product: item.code,
                quantity: item.quantity
            }));
            window.cartItems = cartItems;
            const container = document.getElementById("product-list");
            container.innerHTML = "";

            data.forEach(item => {
                const productDiv = document.createElement("div");
                productDiv.className = "flex gap-4 border-b pb-4 items-center";

                // Tính giá ban đầu theo số lượng
                const hasDiscount = !!item.discount;
                const realUnitPrice = hasDiscount ? item.realPrice : item.price;
                const totalRealPrice = realUnitPrice * item.quantity;

                const priceHtml = `
                    <div class="flex gap-2 text-sm text-gray-500 items-center">
                        <span class="${hasDiscount ? 'text-red-600' : 'text-black'} font-semibold text-base real-price">
                            ${totalRealPrice.toLocaleString()}₫
                        </span>
                        <span class="line-through original-price ${!hasDiscount ? 'hidden' : ''}">
                            ${(item.price * item.quantity).toLocaleString()}₫
                        </span>
                    </div>
                `;

                            productDiv.innerHTML = `
                <div class="relative flex gap-4 items-start">
                    <!-- Nút xoá -->
                    <button 
                        class="absolute -left-5 top-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 delete-btn"
                        data-code="${item.code}"
                    >
                        &times;
                    </button>
            
                    <img src="${item.img}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
            
                    <div class="flex flex-col justify-between flex-grow">
                        <div>
                            <h3 class="text-base font-semibold">${item.name}</h3>
                            ${priceHtml}
                        </div>
                        <div class="flex items-center gap-2">
                            <label>Số lượng:</label>
                            <input 
                                type="number" 
                                value="${item.quantity}" 
                                min="1"
                                class="w-16 border px-2 py-1 rounded quantity-input" 
                                data-code="${item.code}" 
                                data-real="${realUnitPrice}" 
                                data-original="${item.price}"
                            />
                        </div>
                    </div>
                </div>
            `;

                container.appendChild(productDiv);
            });

            // Thêm sự kiện khi thay đổi số lượng
            const quantityInputs = container.querySelectorAll(".quantity-input");
            quantityInputs.forEach(input => {
                input.addEventListener("input", function () {
                    const newQuantity = parseInt(this.value);
                    const code = this.getAttribute("data-code");
                    const realPrice = parseFloat(this.getAttribute("data-real"));
                    const originalPrice = parseFloat(this.getAttribute("data-original"));


                    // Cập nhật giá hiển thị
                    const realPriceEl = this.closest("div.flex-grow").querySelector(".real-price");
                    const originalPriceEl = this.closest("div.flex-grow").querySelector(".original-price");
                    realPriceEl.textContent = (realPrice * newQuantity).toLocaleString() + "₫";
                    originalPriceEl.textContent = (originalPrice * newQuantity).toLocaleString() + "₫";

                    // Gửi dữ liệu lên server
                    fetch(`http://localhost:8080/DATN/cart/save?user=${username}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            product: code,
                            quantity: newQuantity,
                        }),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Lỗi khi lưu giỏ hàng");
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Đã lưu thành công:", data);
                        })
                        .catch(error => {
                            console.error("Lỗi khi gửi dữ liệu:", error);
                        });
                    updateSummary();

                });
                updateSummary();
            });
        })
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
        });
});


function updateSummary() {
    const quantityInputs = document.querySelectorAll(".quantity-input");
    let totalPrice = 0;
    let totalSaved = 0;
    let hasDiscount = false;

    quantityInputs.forEach(input => {
        const quantity = parseInt(input.value);
        const realPrice = parseFloat(input.getAttribute("data-real"));
        const originalPrice = parseFloat(input.getAttribute("data-original"));

        totalPrice += realPrice * quantity;
        const saved = (originalPrice - realPrice) * quantity;
        if (saved > 0) {
            hasDiscount = true;
            totalSaved += saved;
        }
    });

    // Hiển thị tổng trước giảm và số tiền tiết kiệm
    document.getElementById("total-price").textContent = totalPrice.toLocaleString() + "₫";
    const savedElement = document.getElementById("saved-amount");
    if (hasDiscount) {
        savedElement.textContent = "Tiết kiệm " + totalSaved.toLocaleString() + "₫";
        savedElement.classList.remove("hidden");
    } else {
        savedElement.classList.add("hidden");
    }

    // Tính giảm giá
    let discountAmount = 0;
    if (selectedDiscount) {
        if (selectedDiscount.type === 1) {
            // Giảm phần trăm
            discountAmount = totalPrice * selectedDiscount.value / 100;
        } else if (selectedDiscount.type === 2) {
            // Giảm số tiền
            discountAmount = selectedDiscount.value;
        }
    }

    const finalTotal = Math.max(0, totalPrice - discountAmount);
    document.getElementById("final-price").textContent = finalTotal.toLocaleString() + "₫";

    const shippingFeeElement = document.getElementById('ShippingFee');
    if (finalTotal.toLocaleString() < 2000000) {
        shippingFeeElement.innerText = 'Phí vận chuyển: 50.000đ';
    } else {
        shippingFeeElement.innerText = 'Miễn phí vận chuyển';
    }
    updateBankQR();
}


function showError(input, message) {
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = message;
    errorSpan.classList.remove("hidden");
}

function hideError(input) {
    const errorSpan = input.nextElementSibling;
    errorSpan.classList.add("hidden");
}

function validateInput(input, validateFn, message) {
    input.addEventListener("blur", function () {
        if (!validateFn(input.value)) {
            showError(input, message);
        } else {
            hideError(input);
        }
    });

    input.addEventListener("input", function () {
        hideError(input);
    });
}

function showError(input, message) {
    const error = input.parentElement.querySelector(".error");
    error.textContent = message;
    error.classList.remove("hidden");
}

function hideError(input) {
    const error = input.parentElement.querySelector(".error");
    error.classList.add("hidden");
}

function validateInput(input, validateFn, message) {
    input.addEventListener("blur", () => {
        if (!validateFn(input.value)) showError(input, message);
        else hideError(input);
    });

    input.addEventListener("input", () => {
        hideError(input);
    });
}

function validateAll() {
    let isValid = true;
    let firstInvalidElement = null;

    const fullName = document.getElementById("full-name");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");

    const province = document.getElementById("province-select");
    const district = document.getElementById("district-select");
    const ward = document.getElementById("ward-select");

    if (fullName.value.trim() === "") {
        showError(fullName, "Vui lòng nhập họ tên");
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = fullName;
    }

    if (!/^\d{9,11}$/.test(phone.value.trim())) {
        showError(phone, "Số điện thoại không hợp lệ");
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = phone;
    }
    if (address.value.trim() === "") {
        showError(address, "Vui lòng nhập địa chỉ chi tiết");
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = address;
    }

    if (province.value === "") {
        showError(province, "Vui lòng chọn tỉnh/thành");
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = province;
    }

    if (district.value === "") {
        showError(district, "Vui lòng chọn quận/huyện");
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = district;
    }

    if (ward.value === "") {
        showError(ward, "Vui lòng chọn phường/xã");
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = ward;
    }

    if (!isValid && firstInvalidElement) {
        firstInvalidElement.focus();
    }

    return isValid;
}
document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();
    if (validateAll()) {
        // Gửi đơn hàng tại đây
        console.log("Gửi đơn hàng...");
    }
});


let selectedDiscount = null;

// Mở dropdown mã giảm giá
document.getElementById("open-coupon").addEventListener("click", () => {
    document.getElementById("discount-dropdown").classList.toggle("hidden");
});

// Gọi API lấy danh sách mã
fetch("http://localhost:8080/DATN/discount/findAllDiscountValid")
    .then(res => res.json())
    .then(result => {
        const discounts = result.data;
        const list = document.getElementById("discount-list");
        list.innerHTML = "";

        // 👉 Thêm mục mặc định "Không sử dụng mã"
        const noDiscountItem = document.createElement("li");
        noDiscountItem.className = "cursor-pointer p-2 hover:bg-gray-100 rounded font-medium text-gray-600";
        noDiscountItem.textContent = "Không sử dụng mã giảm giá";
        noDiscountItem.addEventListener("click", () => {
            selectedDiscount = null;
            document.getElementById("coupon-code").textContent = "-";
            document.getElementById("discount-dropdown").classList.add("hidden");
            updateSummary();
        });
        list.appendChild(noDiscountItem);

        // 👉 Thêm các mã giảm giá từ API
        discounts.forEach(discount => {
            const li = document.createElement("li");
            li.className = "cursor-pointer p-2 hover:bg-gray-100 rounded";

            // Kiểm tra discount.type và discount.value để tạo label
            let label = "Không rõ";
            if (typeof discount.value === "number") {
                label = discount.type === 1
                    ? discount.value + "%"
                    : discount.value.toLocaleString() + "₫";
            }

            li.textContent = `${discount.name} (${label})`;

            li.addEventListener("click", () => {
                selectedDiscount = discount;
                document.getElementById("coupon-code").textContent = discount.name;
                document.getElementById("discount-dropdown").classList.add("hidden");
                updateSummary();
            });

            list.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Không thể tải mã giảm giá:", err);
    });

function updateBankQR() {
    const selected = document.querySelector('input[name="payment-method"]:checked')?.value;
    const qrContainer = document.getElementById("bank-transfer-qr");
    const submitButton = document.getElementById("submit");
    const paymentStatusMessage = document.getElementById("payment-status-message"); // Thông báo trạng thái thanh toán

    if (selected === "bank") {
        const amountText = document.getElementById("final-price").textContent.replace(/[^\d]/g, "");
        const amount = parseInt(amountText);

        const qrLink = `https://img.vietqr.io/image/VCB-1017409232-compact2.png?amount=${amount}&addInfo=Thanh+toan+don+hang`;
        document.getElementById("qr-image").src = qrLink;

        qrContainer.classList.remove("hidden");

        // Chắc chắn ẩn nút "Hoàn tất đơn hàng" và hiển thị thông báo yêu cầu thanh toán
        submitButton.disabled = true;
        paymentStatusMessage.textContent = "Bạn cần hoàn tất thanh toán trước khi hoàn thành đơn hàng.";
        paymentStatusMessage.classList.remove("hidden");
    } else {
        qrContainer.classList.add("hidden");

        // Hủy thông báo thanh toán và hiển thị nút "Hoàn tất đơn hàng"
        paymentStatusMessage.classList.add("hidden");
        submitButton.disabled = false;
    }
}

// 1. Khi updateBankQR hiển thị QR thì cũng bật nút "Tôi đã thanh toán"
const origUpdateBankQR = updateBankQR;
updateBankQR = function() {
    origUpdateBankQR(); // giữ nguyên logic hiện tại

    const confirmBtn = document.getElementById("confirmPaymentBtn");
    // nếu đang chọn chuyển khoản => show nút, ngược lại ẩn
    if (document.querySelector('input[name="payment-method"]:checked').value === "bank") {
        confirmBtn.classList.remove("hidden");
    } else {
        confirmBtn.classList.add("hidden");
    }
};

// 2. Gắn sự kiện cho nút "Tôi đã thanh toán"
document
    .getElementById("confirmPaymentBtn")
    .addEventListener("click", onPaymentSuccess);

// 3. Khởi chạy lần đầu để đảm bảo nút và trạng thái đúng
window.addEventListener("DOMContentLoaded", updateBankQR);

// Khi thanh toán thành công
function onPaymentSuccess() {
    const qrContainer = document.getElementById("bank-transfer-qr");
    const submitButton = document.getElementById("submit");
    const paymentStatusMessage = document.getElementById("payment-status-message");

    // Ẩn QR và thông báo thanh toán
    qrContainer.classList.add("hidden");
    paymentStatusMessage.textContent = "Thanh toán thành công!";
    paymentStatusMessage.classList.add("text-green-600"); // Thêm màu xanh để thông báo thành công

    // Kích hoạt lại nút "Hoàn tất đơn hàng"
    submitButton.disabled = false;
    submitButton.classList.remove("bg-blue-600", "hover:bg-blue-500");
    submitButton.classList.add("bg-green-600", "hover:bg-green-500"); // Nút hoàn tất đơn hàng sẽ chuyển sang màu xanh lá khi thanh toán thành công
}


document.querySelectorAll('input[name="payment-method"]').forEach(input => {
    input.addEventListener("change", updateBankQR);
});

document.getElementById("product-list").addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        const code = e.target.getAttribute("data-code");
        const user = localStorage.getItem("username");

        if (user && code) {
            fetch(`http://localhost:8080/DATN/cart/delete?user=${user}&product=${code}`, {
                method: "PUT",
            })
                .then(response => {
                    if (response.ok) {
                        location.reload(); // hoặc bạn có thể gọi lại hàm loadCart();
                    } else {
                        console.error("Xoá sản phẩm thất bại.");
                    }
                })
                .catch(err => console.error("Lỗi khi gọi API xoá:", err));
        }
    }
});

function saveOrder(){
    const fullName = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const province = document.getElementById('province-select').options[document.getElementById('province-select').selectedIndex].text;
    const district = document.getElementById('district-select').options[document.getElementById('district-select').selectedIndex].text;
    const ward = document.getElementById('ward-select').options[document.getElementById('ward-select').selectedIndex].text;
    const addressDetail = document.getElementById('address').value.trim();
    const address = `${addressDetail}, ${ward}, ${district}, ${province}`;
    const note = document.getElementById('note').value.trim();

    const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethodValue = paymentMethodElement ? paymentMethodElement.value : 'cod';
    const paymentMethod = paymentMethodValue === 'bank' ? 'BANK_TRANSFER' : 'CASH';

    let paymentstatus = 2; //chưa thanh toán

    if (paymentMethod === 'BANK_TRANSFER') {
        paymentstatus = 1;
    }
    const orderData = {
        customer:fullName,
        phone:phone,
        paymentMethod: paymentMethod,
        paymentStatus: paymentstatus,
        address: address,
        note: note,
        discount : selectedDiscount ? selectedDiscount.code : null,
        userNameCustomer : username,

        orderDetails: cartItems
    };
    console.log('Order Data:', orderData);
    fetch("http://localhost:8080/DATN/order/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData) // body là dữ liệu đơn hàng đã chuẩn bị
    })
        .then(res => res.json())
        .then(response => {
            if (response.code === 200 && response.data && response.data.code) {
                const orderCode = response.data.code;
                // Lưu vào localStorage để trang thankyou.html dùng
                localStorage.setItem('orderCode', orderCode);
                console.log(orderCode);
                alert("Đặt hàng thành công!");
                // Xóa giỏ hàng
                return fetch(`http://localhost:8080/DATN/cart/clearCart?user=${username}`, {
                    method: "DELETE"
                });
            } else {
                // nếu API trả về lỗi
                throw new Error(response.message || 'Lỗi tạo đơn hàng');
            }
        })
        .then(resClear => {
            if (resClear.ok) {
                window.location.href = "thankyou.html";
            } else {
                console.warn('Xóa giỏ hàng không thành công');
                window.location.href = "thankyou.html";
            }
        })
        .catch(err => {
            console.error(err);
            alert(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
        });
}