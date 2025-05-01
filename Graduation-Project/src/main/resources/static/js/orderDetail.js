// orderDetail.js
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
            alert('Không tải được chi tiết đơn hàng.');
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
            case 5: return "Hoàn thành";
            case 6: return "Đơn hàng đã hủy";
            default: return "Không xác định";
        }
    };
    document.getElementById('od-orderStatus').textContent = convertOrderStatus(order.status);

    // Hiển thị danh sách sản phẩm
    const itemsContainer = document.getElementById('od-items');
    itemsContainer.innerHTML = ''; // reset
    order.orderDetails.forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'flex items-center justify-between space-x-4';

        // Ảnh sản phẩm
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.product;
        img.className = 'w-20 h-20 object-cover rounded';

        // Phần tên sản phẩm
        const desc = document.createElement('div');
        desc.className = 'flex-1';
        desc.innerHTML = `
            <div class="text-lg font-medium">${item.name}</div>
        `;

        // Phần số lượng + giá tiền (xếp dọc)
        const rightInfo = document.createElement('div');
        rightInfo.className = 'flex flex-col items-end';
        rightInfo.innerHTML = `
            <div class="text-sm text-gray-600">Số lượng: ${item.quantity}</div>
            <div class="text-lg font-semibold text-red-600">${item.totalPrice.toLocaleString()}₫</div>
        `;

        // Gom lại
        wrap.append(img, desc, rightInfo);
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
            if (confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) {
                fetch(`http://localhost:8080/DATN/order/cancel?code=${order.code}`, {
                    method: 'POST'
                }).then(() => location.reload());
            }
        };
    }
}


