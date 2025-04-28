let currentOrderData = null;
// Hàm load chi tiết đơn hàng
const loadOrderDetail = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Lấy mã code từ URL

    if (!code) {
        alert("Không tìm thấy mã đơn hàng");
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/DATN/order/detail?code=${code}`);
        const json = await res.json();
        const data = json.data;
        currentOrderData = data;
        if (!data) {
            alert("Không tìm thấy đơn hàng");
            return;
        }

        // Render Thông tin đơn hàng
        renderOrderInfo(data);

        // Render Chi tiết đơn hàng
        renderOrderDetails(data.orderDetails || []);

    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        alert("Lỗi kết nối server");
    }
};

const renderOrderInfo = (order) => {
    const orderInfoTable = document.getElementById('orderInfoTable');
    const orderId = document.getElementById("orderId");
    orderId.textContent = order.id;

    // Xóa nội dung hiện tại trong bảng (nếu có)
    orderInfoTable.innerHTML = '';

    const tbody = document.createElement('tbody');

    // Tạo các dòng dữ liệu
    tbody.innerHTML = `
        ${generateRow("Mã đơn hàng", order.code)}
        ${generateFormGroup("Tên khách hàng", `<input type="text" id="customer" value="${order.customer || ''}" class="input-field" />`)}
        ${generateFormGroup("Địa chỉ", `<input type="text" id="address" value="${order.address || ''}" class="input-field" />`)}
        ${generateFormGroup("Số điện thoại", `<input type="text" id="phone" value="${order.phone || ''}" class="input-field" />`)}
        ${generateRow("Giảm giá", order.discount || "Không có")}
        ${generateRow("Nhân viên xử lý", order.employee || "Chưa có")}
        ${generateRow("Ngày tạo", formatDate(order.createdAt))}
        ${generateRow("Ngày cập nhật", formatDate(order.updatedAt))}
        ${generateRow("Trạng thái đơn hàng", convertOrderStatus(order.status))}
        ${generateRow("Tổng tiền hàng", formatCurrency(order.totalPrice))}
        ${generateRow("Phí vận chuyển", formatCurrency(order.shippingFee))}
        ${generateRow("Tổng tiền hóa đơn", formatCurrency(order.realPrice))}
        ${generateFormGroup("Phương thức thanh toán", `
            <select id="paymentMethod" class="input-field">
                <option value="CASH" ${order.paymentMethod === "CASH" ? "selected" : ""}>Tiền mặt</option>
                <option value="BANK_TRANSFER" ${order.paymentMethod === "BANK_TRANSFER" ? "selected" : ""}>Chuyển khoản</option>
            </select>
        `)}
        
        ${generateFormGroup("Trạng thái thanh toán", `
            <select id="paymentStatus" class="input-field">
                <option value="1" ${order.paymentStatus === 1 ? "selected" : ""}>Đã thanh toán</option>
                <option value="2" ${order.paymentStatus === 2 ? "selected" : ""}>Chưa thanh toán</option>
            </select>
        `)}
    `;

    // Thêm tbody vào bảng
    orderInfoTable.appendChild(tbody);
};

const generateRow = (label, value) => {
    return `
        <tr>
            <td class="font-bold">${label}</td>
            <td>${value}</td>
        </tr>
    `;
};

const generateFormGroup = (label, inputHtml) => {
    return `
        <tr>
            <td class="font-bold">${label}</td>
            <td>${inputHtml}</td>
        </tr>
    `;
};

const renderOrderDetails = (details) => {
    const orderDetailsTable = document.getElementById('orderDetailsTable').querySelector('tbody');
    orderDetailsTable.innerHTML = details.map(d => `
      <tr>
        <td class="border px-4 py-2">${d.productName}</td>
        <td class="border px-4 py-2">${formatCurrency(d.price)}</td>
        <td class="border px-4 py-2">${d.quantity}</td>
        <td class="border px-4 py-2">${formatCurrency(d.totalPrice)}</td>
      </tr>
    `).join('');
};

// Hàm hỗ trợ:
const formatCurrency = (amount) => {
    if (!amount) return "0đ";
    return Number(amount).toLocaleString('vi-VN') + 'đ';
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN') + " " + d.toLocaleTimeString('vi-VN');
};

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

const convertPaymentMethod = (method) => {
    if (method === "CASH") return "Tiền mặt";
    if (method === "BANK_TRANSFER") return "Chuyển khoản";
    return "Không xác định";
};

const convertPaymentStatus = (status) => {
    if (status === 1) return "Đã thanh toán";
    if (status === 2) return "Chưa thanh toán";
    return "Không xác định";
};
document.getElementById('saveOrderBtn').addEventListener('click', async () => {
    if (!currentOrderData) return;

    // Lấy dữ liệu chỉnh sửa
    const customer = document.getElementById('customer').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentStatus = parseInt(document.getElementById('paymentStatus').value);


    const payload = {
        id: document.getElementById("orderId").textContent.trim(),
        code: currentOrderData.code,
        customer:customer,
        address:address,
        phone:phone,
        paymentMethod:paymentMethod,
        paymentStatus:paymentStatus,
        discount: currentOrderData.discount,
        employee: currentOrderData.employee,
        status: currentOrderData.status,
        totalPrice: currentOrderData.totalPrice,
        realPrice: currentOrderData.realPrice,
        shippingFee: currentOrderData.shippingFee,
        orderDetails: currentOrderData.orderDetails.map(d => ({
            product: d.product,
            quantity: d.quantity
        })) // Chuyển các chi tiết đã cập nhật
    };

    try {
        const res = await fetch(`http://localhost:8080/DATN/order/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Cập nhật đơn hàng thành công');
            window.location.href = "/managerOrder.html"; // Quay lại danh sách đơn hàng
        } else {
            alert('Cập nhật đơn hàng thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi lưu đơn hàng:', error);
        alert('Lỗi kết nối server');
    }
});
// Gọi load khi trang load
loadOrderDetail();
