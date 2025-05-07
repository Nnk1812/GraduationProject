const pageSize = 3;
let currentPage = 1;
let allOrders = [];

const user = localStorage.getItem("username");
const orderTable = document.getElementById("orderTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

// Bản đồ status
const orderStatusMap = {
    1: "Chưa xác nhận",
    2: "Đã xác nhận",
    3: "Đã chuyển giao tới đơn vị giao hàng",
    4: "Đang giao hàng",
    5: "Đã hoàn thành",
    6: "Đơn hàng đã hủy",
    7: "Trả hàng"
};
const paymentStatusMap = {
    1: "Đã thanh toán",
    2: "Chưa thanh toán"
};
const paymentMethodMap = {
    "CASH": "Thanh toán khi nhận hàng (COD)",
    "BANK_TRANSFER": "Chuyển khoản ngân hàng"
};

// Định dạng ngày
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
};

// Render đơn hàng
const renderOrders = (orders) => {
    orderTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginated = orders.slice(startIndex, startIndex + pageSize);

    paginated.forEach((o, idx) => {
        const no = startIndex + idx + 1;
        const statusText = orderStatusMap[o.status] || o.status;
        const payStatusText = paymentStatusMap[o.paymentStatus] || o.paymentStatus;
        const payMethodText = paymentMethodMap[o.paymentMethod] || o.paymentMethod;
        const total = o.priceToPay?.toLocaleString() + "₫";
        const created = formatDate(o.createdAt);
        const update = formatDate(o.updatedAt)

        let updateBtn = '';
        if (o.status === 1) {
            updateBtn = `<button onclick="handleConfirm('${o.code}')" class="bg-yellow-500 text-white w-full h-full rounded hover:bg-yellow-600">Xác nhận đơn</button>`;
        } else if (o.status === 2) {
            updateBtn = `<button onclick="handleTranfer('${o.code}')" class="bg-blue-500 text-white w-full h-full rounded hover:bg-blue-600">Đóng gói</button>`;
        } else if (o.status === 3) {
            updateBtn = `<button onclick="handleDelivery('${o.code}')" class="bg-green-500 text-white w-full h-full rounded hover:bg-green-600">Giao hàng</button>`;
        } else if (o.status === 4) {
            updateBtn = `<button disabled class="bg-sky-200 text-sky-800 w-full h-full rounded cursor-not-allowed">Đợi xác nhận</button>`;
        } else if (o.status === 5) {
            updateBtn = `<button disabled class="bg-lime-200 text-lime-800 w-full h-full rounded cursor-not-allowed">Hoàn thành đơn</button>`;
        }

        const cancelBtn = (o.status < 3 && o.status !== 6)
            ? `<button onclick="handleCancle('${o.code}')" class="bg-red-600 text-white w-full h-full rounded hover:bg-red-700">Hủy</button>`
            : '';


    const actionButtons = `
            <div class="flex h-12 w-64 mx-auto gap-2">
            <div class="flex-[3]">
            ${updateBtn}
    </div>
        ${cancelBtn ? `<div class="flex-1">${cancelBtn}</div>` : ''}
    </div>
        `;
        orderTable.innerHTML += `
        <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-2">${no}</td>
            <td class="px-4 py-2">
                <a href="orderManagerDetail.html?code=${o.code}"
                   class="text-blue-600 hover:underline">${o.code}</a>
            </td>
            <td class="px-4 py-2">${o.customer || "-"}</td>
            <td class="px-4 py-2">${o.employee || "-"}</td>
            <td class="px-4 py-2">${created}</td>
            <td class="px-4 py-2">${update}</td>
            <td class="px-4 py-2">${statusText}</td>
            <td class="px-4 py-2">${total}</td>
            <td class="px-4 py-2">${payMethodText}<br/><small>${payStatusText}</small></td>
            <td class="px-4 py-2 flex space-x-2">${actionButtons}</td>
        </tr>`;
    });

    renderPagination(orders.length);
};

// Phân trang (giữ nguyên từ trước)
const renderPagination = (totalItems) => {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / pageSize);

    const makeBtn = (label, enabled, onClick) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = `mx-1 px-3 py-1 rounded ${enabled ?
            'bg-blue-500 text-white hover:bg-blue-600' :
            'bg-gray-300 cursor-not-allowed'}`;
        if (!enabled) btn.disabled = true;
        else btn.addEventListener("click", onClick);
        paginationContainer.appendChild(btn);
    };

    makeBtn("← Trước", currentPage > 1, () => {
        currentPage--; renderOrders(filteredOrders());
    });
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `mx-1 px-3 py-1 rounded ${i === currentPage ?
            'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        btn.addEventListener("click", () => {
            currentPage = i; renderOrders(filteredOrders());
        });
        paginationContainer.appendChild(btn);
    }
    makeBtn("Sau →", currentPage < totalPages, () => {
        currentPage++; renderOrders(filteredOrders());
    });
};

const filteredOrders = () => {
    const kw = searchInput.value.trim().toLowerCase();
    const statusVal = statusFilter.value;
    return allOrders.filter(o => {
        const matchesText =
            o.code.toLowerCase().includes(kw) ||
            (o.customer || "").toLowerCase().includes(kw) ||
            (o.employee || "").toLowerCase().includes(kw);
        const matchesStatus = statusVal ? o.status.toString() === statusVal : true;
        return matchesText && matchesStatus;
    });
};

// Fetch và init
const fetchOrders = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/order/findAll");
        const json = await res.json();
        allOrders = json.data || [];
        currentPage = 1;
        renderOrders(filteredOrders());

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderOrders(filteredOrders());
        });
    } catch (e) {
        console.error("Lỗi fetch orders:", e);
        orderTable.innerHTML = `<tr><td colspan="8" class="py-4 text-red-500">Không tải được danh sách đơn hàng</td></tr>`;
    }
};

// Hủy đơn hàng
const handleCancle = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
    try {
        const res = await fetch(`http://localhost:8080/DATN/order/cancel?code=${code}`, { method: 'POST' });
        if (res.ok) {
            alert("Hủy thành công");
            fetchOrders();
        } else {
            alert("Hủy thất bại");
        }
    } catch (e) {
        console.error("Lỗi delete order:", e);
        alert("Lỗi kết nối");
    }
};

const handleConfirm = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này?")) return;
    try {
        const userRes = await fetch(`http://localhost:8080/DATN/user/findUser?user=${user}`);
        if (!userRes.ok) {
            alert("Lấy thông tin người dùng thất bại");
            return;
        }
        const userJson = await userRes.json();
        const fullName = userJson.data?.fullName;

        const res = await fetch(`http://localhost:8080/DATN/order/confirm?code=${code}&user=${fullName}`, { method: 'POST' });
        if (res.ok) {
            alert("Xác nhận đơn hàng thành công");
            fetchOrders();
        } else {
            alert("Xác nhận đơn hàng thất bại");
        }
    } catch (e) {
        console.error("Lỗi delete order:", e);
        alert("Lỗi kết nối");
    }
};

const handleTranfer = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn đóng gói đơn hàng này?")) return;
    try {
        const res = await fetch(`http://localhost:8080/DATN/order/transfer?code=${code}`, { method: 'POST' });
        if (res.ok) {
            alert("Đóng gói thành công");
            fetchOrders();
        } else {
            alert("Đóng gói thất bại");
        }
    } catch (e) {
        console.error("Lỗi delete order:", e);
        alert("Lỗi kết nối");
    }
};

const handleDelivery = async (code) => {
    if (!confirm("Bạn có chắc chắn muốn vận chuyển đơn hàng này?")) return;
    try {
        const res = await fetch(`http://localhost:8080/DATN/order/delivery?code=${code}`, { method: 'POST' });
        if (res.ok) {
            alert("vận chuyển thành công");
            fetchOrders();
        } else {
            alert("vận chuyển thất bại");
        }
    } catch (e) {
        console.error("Lỗi delete order:", e);
        alert("Lỗi kết nối");
    }
};

// Xem chi tiết


window.addEventListener("DOMContentLoaded", fetchOrders);
