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

    // Xóa nội dung hiện tại
    orderInfoTable.innerHTML = '';

    // Tạo thead (nếu muốn)
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th class="text-left py-2 px-4">Thông tin</th>
            <th class="text-left py-2 px-4">Chi tiết</th>
        </tr>
    `;
    orderInfoTable.appendChild(thead);

    // Tạo tbody
    const tbody = document.createElement('tbody');

    const rows = [
        generateRow("Mã đơn hàng", order.code),
        generateInputRow("Tên khách hàng", "customer", order.customer),
        generateInputRow("Địa chỉ", "address", order.address),
        generateInputRow("Số điện thoại", "phone", order.phone),
        generateRow("Giảm giá", order.discount || "Không có"),
        generateRow("Nhân viên xử lý", order.employee || "Chưa có"),
        generateRow("Ngày tạo", formatDate(order.createdAt)),
        generateRow("Ngày cập nhật", formatDate(order.updatedAt)),
        generateRow("Trạng thái đơn hàng", convertOrderStatus(order.status)),
        generateRow("Tổng tiền hàng", formatCurrency(order.totalPrice)),
        generateRow("Phí vận chuyển", formatCurrency(order.shippingFee)),
        generateRow("Tổng tiền hóa đơn", formatCurrency(order.realPrice)),
        generateSelectRow("Phương thức thanh toán", "paymentMethod", [
            { value: "CASH", label: "Tiền mặt" },
            { value: "BANK_TRANSFER", label: "Chuyển khoản" }
        ], order.paymentMethod),
        generateSelectRow("Trạng thái thanh toán", "paymentStatus", [
            { value: 1, label: "Đã thanh toán" },
            { value: 2, label: "Chưa thanh toán" }
        ], order.paymentStatus)
    ];

    // Thêm tất cả rows vào tbody
    rows.forEach(row => {
        tbody.appendChild(row);
    });

    orderInfoTable.appendChild(tbody);
};

// Helper: Tạo dòng thường
const generateRow = (label, value) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="border py-2 px-4 font-medium">${label}</td>
        <td class="border py-2 px-4">${value}</td>
    `;
    return tr;
};

// Helper: Tạo dòng có input
const generateInputRow = (label, id, value = '') => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="border py-2 px-4 font-medium">${label}</td>
        <td class="border py-2 px-4">
            <input type="text" id="${id}" value="${value}" class="input-field w-full p-2 border rounded" />
        </td>
    `;
    return tr;
};

// Helper: Tạo dòng có select
const generateSelectRow = (label, id, options, selectedValue) => {
    const tr = document.createElement('tr');
    const optionHtml = options.map(opt => `
        <option value="${opt.value}" ${opt.value == selectedValue ? 'selected' : ''}>${opt.label}</option>
    `).join('');

    tr.innerHTML = `
        <td class="border py-2 px-4 font-medium">${label}</td>
        <td class="border py-2 px-4">
            <select id="${id}" class="input-field w-full p-2 border rounded">
                ${optionHtml}
            </select>
        </td>
    `;
    return tr;
};


const renderOrderDetails = (details) => {
    const orderDetailsTable = document.getElementById('orderDetailsTable').querySelector('tbody');
    orderDetailsTable.innerHTML = details.map(d => `
      <tr>
        <td class="border px-4 py-2">${d.name}</td>
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
        case 5: return "Đã giao hàng";
        case 6: return "Đã nhận hàng";
        case 7: return "Đơn hàng đã hủy";
        case 8: return "Trả hàng";
        case 9: return "Khách hàng đã trả hàng và hàng đã về kho";
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
            id : d.id,
            orderCode : d.orderCode,
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
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhập đơn hàng thành công!',
            });
            window.location.href = "/DATN/pages/managerOrder.html"; // Quay lại danh sách đơn hàng
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Cập nhập thất bại!',
            });
        }
    } catch (error) {
        console.error('Lỗi khi lưu đơn hàng:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Lỗi kết nối server!',
        });
    }
});
// Gọi load khi trang load
loadOrderDetail();
