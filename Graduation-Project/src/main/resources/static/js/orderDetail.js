const username = localStorage.getItem("username");

document.addEventListener('DOMContentLoaded', () => {
    // 2) Gọi API lấy chi tiết
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Lấy mã code từ URL
    fetch(`http://localhost:8080/DATN/order/detail?code=${code}`)
        .then(res => {
            if (!res.ok) throw new Error('Lỗi khi fetch chi tiết đơn hàng');
            return res.json();
        })
        .then(json => renderOrder(json.data))
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không tải được chi tiết đơn hàng!',
            });
        });
});

const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN') + " " + d.toLocaleTimeString('vi-VN');
};

function renderOrder(order) {
    // Hiển thị thông tin đơn hàng
    document.getElementById('od-customer').textContent = order.customer;
    document.getElementById('od-phone').textContent = order.phone;
    document.getElementById('od-address').textContent = order.address;

    // Thêm phần thông tin đơn hàng
    document.getElementById('od-employee').textContent = order.employee;  // Nhân viên
    document.getElementById('od-createdDate').textContent = formatDate(order.createdAt); // Ngày tạo
    document.getElementById('od-updatedDate').textContent = formatDate(order.updatedAt); // Ngày cập nhật
    const convertOrderStatus = (status) => {
        switch (status) {
            case 1: return "Chưa xác nhận";
            case 2: return "Đã xác nhận";
            case 3: return "Đã đóng gói và chờ chuyển giao tới đơn vị giao hàng";
            case 4: return "Đang giao hàng";
            case 5: return "Đã giao hàng";
            case 6: return "Đã nhận hàng";
            case 7: return "Đơn hàng đã hủy";
            case 8: return "Trả hàng";
            case 9: return "Khách hàng đã trả hàng và hàng đã về kho";
            default: return "Không xác định";
        }
    };
    document.getElementById('od-orderStatus').textContent = convertOrderStatus(order.status);

    // Hiển thị danh sách sản phẩm
    const itemsContainer = document.getElementById('od-items');
    itemsContainer.innerHTML = ''; // reset

    order.orderDetails.forEach((item, index) => {
        const wrap = document.createElement('div');
        wrap.className = 'flex justify-between items-center space-x-4 p-4 border-b';

        // Ảnh sản phẩm (trái)
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.product;
        img.className = 'w-24 h-24 object-cover rounded';

        // Tên và mã sản phẩm (phải ảnh)
        const info = document.createElement('div');
        info.className = 'flex flex-col flex-1';

        const name = document.createElement('div');
        name.textContent = item.name;
        name.className = 'text-base font-semibold';

        const code = document.createElement('div');
        code.textContent = `Mã: ${item.product}`;
        code.className = 'text-sm text-gray-500';

        info.appendChild(name);
        info.appendChild(code);

        // Phần số lượng + giá + nút đánh giá nếu cần
        const rightInfo = document.createElement('div');
        rightInfo.className = 'flex flex-col items-end justify-between';

        rightInfo.innerHTML = ` 
        <div class="text-sm text-gray-600">Số lượng: ${item.quantity}</div>
        <div class="text-lg font-semibold text-red-600">${item.totalPrice.toLocaleString()}₫</div>
    `;

        // Nếu đã giao hàng, hiển thị nút đánh giá nếu chưa đánh giá
        if (order.status === 6) {
            const reviewed = JSON.parse(localStorage.getItem('reviewedProducts') || '[]');
            if (!reviewed.includes(item.product)) {
                const reviewBtn = document.createElement('button');
                reviewBtn.textContent = 'Đánh giá';
                reviewBtn.className = 'mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600';
                reviewBtn.onclick = () => {
                    document.getElementById('reviewModal').classList.remove('hidden');
                    document.getElementById('rating').value = '';
                    document.getElementById('comment').value = '';
                    updateStarDisplay(-1);
                    document.getElementById('submitReview').dataset.product = item.product;
                };
                rightInfo.appendChild(reviewBtn);
            }
        }

        // Thêm các phần tử vào wrap
        wrap.append(img, info, rightInfo);
        itemsContainer.appendChild(wrap);
    });




    // Phí vận chuyển & thành tiền
    document.getElementById('od-shippingFee').textContent = `${order.shippingFee.toLocaleString()}₫`;
    document.getElementById('od-priceToPay').textContent = `${order.priceToPay.toLocaleString()}₫`;

    // Phương thức & trạng thái thanh toán
    document.getElementById('od-paymentMethod').textContent =
        order.paymentMethod === 'CASH'
            ? 'Thanh toán khi nhận hàng (COD)'
            : 'Chuyển khoản ngân hàng';
    const statusMap = {
        1: 'Đã thanh toán',
        2: 'Chưa thanh toán',
    };
    document.getElementById('od-paymentStatus').textContent =
        statusMap[order.paymentStatus] || order.paymentStatus;

    // Các nút Hủy / Chỉnh sửa
    if (order.status === 1 || order.status === 2) {
        const actions = document.getElementById('od-actions');
        actions.innerHTML = ` 
            <button id="cancelBtn"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Hủy đơn hàng
            </button>
        `;
        document.getElementById('cancelBtn').onclick = () => {
            const url = `http://localhost:8080/DATN/order/cancel?code=${order.code}`;
            handleAction(url, 'Bạn chắc chắn muốn hủy đơn hàng này?');
        };
    }
    if (order.status === 5) {
        const actions = document.getElementById('od-actions');
        actions.innerHTML = `
        <div class="flex gap-4">
            <button id="receiveBtn"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Đã nhận hàng và thanh toán
            </button>
            <button id="returnBtn"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Trả hàng
            </button>
        </div>
    `;
        document.getElementById('receiveBtn').onclick = async () => {
            const result = await Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn đã nhận hàng và thanh toán chưa?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:8080/DATN/order/confirm?code=${order.code}`, {
                        method: 'POST'
                    });
                    if (res.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Đã cập nhật trạng thái đơn hàng!'
                        });
                        location.reload();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Thất bại',
                            text: 'Không thể cập nhật đơn hàng.'
                        });
                    }
                } catch (e) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi kết nối',
                        text: 'Không thể kết nối tới server.'
                    });
                }
            }
        };

        document.getElementById('returnBtn').onclick = async () => {
            const result = await Swal.fire({
                title: 'Xác nhận trả hàng',
                text: 'Bạn chắc chắn muốn trả hàng?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Trả hàng',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:8080/DATN/order/return?code=${order.code}`, {
                        method: 'POST'
                    });
                    if (res.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã trả hàng',
                            text: 'Đơn hàng đã được xử lý.'
                        });
                        location.reload();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể thực hiện thao tác.'
                        });
                    }
                } catch (e) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi kết nối',
                        text: 'Không thể kết nối tới server.'
                    });
                }
            }
        };
    }


    // Xử lý khi nhấn nút Đánh giá sản phẩm
    // if (order.status === 5) {
    //     const actions = document.getElementById('od-actions');
    //     actions.innerHTML = `
    //     <button id="reviewBtn"
    //         class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
    //       Đánh giá sản phẩm
    //     </button>
    // `;
    //
    //     document.getElementById('reviewBtn').onclick = () => {
    //         // Hiển thị modal đánh giá với ngôi sao
    //         document.getElementById('reviewModal').classList.remove('hidden');
    //     };
    // }

// Đóng modal khi click vào nút Close
    document.getElementById('closeModal').onclick = () => {
        document.getElementById('reviewModal').classList.add('hidden');
    };

// Xử lý sự kiện click vào ngôi sao để đánh giá
    const starRating = document.querySelectorAll('.star-rating .star');
    starRating.forEach((star, index) => {
        star.addEventListener('click', () => {
            // Cập nhật giá trị rating trong input hidden
            document.getElementById('rating').value = index + 1; // Lưu giá trị sao đã chọn

            // Cập nhật hiển thị sao để tô màu
            updateStarDisplay(index);
        });
    });

// Hàm cập nhật màu sắc các ngôi sao khi người dùng click
    function updateStarDisplay(index) {
        starRating.forEach((star, i) => {
            if (i <= index) {
                star.classList.add('text-yellow-500'); // Tô màu vàng cho các sao đã chọn
                star.classList.remove('text-gray-400'); // Bỏ màu xám cho các sao đã chọn
            } else {
                star.classList.remove('text-yellow-500'); // Bỏ màu vàng cho các sao chưa chọn
                star.classList.add('text-gray-400'); // Thêm màu xám cho các sao chưa chọn
            }
        });
    }

// Xử lý khi người dùng gửi đánh giá
    document.getElementById('submitReview').onclick = () => {
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;

        if (!rating || !comment) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: 'Vui lòng điền đủ thông tin!',
            });
            return;
        }

        const productCode = document.getElementById('submitReview').dataset.product;

        fetch('http://localhost:8080/DATN/products/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: productCode,
                user: username,
                rating: parseInt(rating),
                comment: comment,
            })
        })
            .then(res => res.json())
            .then(data => {
                // Đánh dấu đã đánh giá sản phẩm này
                let reviewed = JSON.parse(localStorage.getItem('reviewedProducts') || '[]');
                if (!reviewed.includes(productCode)) {
                    reviewed.push(productCode);
                    localStorage.setItem('reviewedProducts', JSON.stringify(reviewed));
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Cảm ơn bạn!',
                    text: 'Cảm ơn bạn đã đánh giá',
                    timer: 2000,
                    showConfirmButton: false
                });

                document.getElementById('reviewModal').classList.add('hidden');
                location.reload();
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Lỗi kết nối server!',
                });
            });
    };


}
