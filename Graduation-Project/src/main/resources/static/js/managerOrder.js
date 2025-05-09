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
    3: "Đã đóng gói và chờ chuyển giao tới đơn vị giao hàng",
    4: "Đang giao hàng",
    5: "Đã giao hàng",
    6: "Đã nhận hàng",
    7: "Đơn hàng đã hủy",
    8: "Trả hàng",
    9: "Khách hàng trả hàng và hàng đã về kho"
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
    orders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
            updateBtn = `<button onclick="handleConfirmOrder('${o.code}')" class="bg-yellow-500 text-white w-full h-full rounded hover:bg-yellow-600">Xác nhận đơn</button>`;
        } else if (o.status === 2) {
            updateBtn = `<button onclick="handleTranfer('${o.code}')" class="bg-blue-500 text-white w-full h-full rounded hover:bg-blue-600">Đóng gói</button>`;
        } else if (o.status === 3) {
            updateBtn = `<button onclick="handleDelivery('${o.code}')" class="bg-green-500 text-white w-full h-full rounded hover:bg-green-600">Giao hàng</button>`;
        } else if (o.status === 4) {
            updateBtn = `<button onclick="handleConfirm('${o.code}')" class="bg-sky-200 text-sky-800 w-full h-full rounded hover:bg-sky-200">Hoàn thành giao hàng</button>`;
        } else if (o.status === 5) {
            updateBtn = `<button disabled  class="bg-lime-200 text-lime-800 w-full h-full rounded cursor-not-allowed">Đợi xác nhận</button>`;
        }else if (o.status === 6) {
            updateBtn = `<button disabled class="bg-lime-200 text-lime-800 w-full h-full rounded cursor-not-allowed">Hoàn thành đơn</button>`;
        }
        else if (o.status === 7) {
            updateBtn = `<button disabled class="bg-lime-200 text-lime-800 w-full h-full rounded cursor-not-allowed">Đơn hàng đã hủy</button>`;
        }
        else if (o.status === 8) {
            updateBtn = `<button onclick="handleReturnProduct('${o.code}')" class="bg-lime-200 text-lime-800 w-full h-full rounded hover:bg-lime-200">Xác nhận sản phẩm về kho</button>`;
        }
        else if (o.status === 9) {
            updateBtn = `<button disabled  class="bg-lime-200 text-lime-800 w-full h-full rounded cursor-not-allowed">Sản phẩm đã về kho</button>`;
        }


        const cancelBtn = (o.status < 3 && o.status !== 6)
            ? `<button onclick="handleCancel('${o.code}')" class="bg-red-600 text-white w-full h-full rounded hover:bg-red-700">Hủy</button>`
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
            <td class="px-4 py-2">${o.phone}</td>
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
            (o.employee || "").toLowerCase().includes(kw) ||
            (o.phone || "").toLowerCase().includes(kw);
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
const handleCancel = async (code) => {
    Swal.fire({
        title: 'Xác nhận hủy',
        text: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hủy đơn',
        cancelButtonText: 'Thoát',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:8080/DATN/order/cancel?code=${code}`, { method: 'POST' });
                if (res.ok) {
                    Swal.fire('Thành công', 'Đã hủy đơn hàng!', 'success');
                    fetchOrders();
                } else {
                    Swal.fire('Lỗi', 'Hủy đơn hàng thất bại!', 'error');
                }
            } catch (e) {
                console.error("Lỗi khi hủy đơn:", e);
                Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
            }
        }
    });
};

// Xác nhận đơn hàng
const handleConfirmOrder = async (code) => {
    Swal.fire({
        title: 'Xác nhận đơn hàng',
        text: 'Bạn có chắc chắn muốn xác nhận đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Thoát',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const userRes = await fetch(`http://localhost:8080/DATN/user/findUser?user=${user}`);
                if (!userRes.ok) {
                    Swal.fire('Lỗi', 'Lấy thông tin người dùng thất bại!', 'error');
                    return;
                }
                const userJson = await userRes.json();
                const fullName = userJson.data?.fullName;

                const res = await fetch(`http://localhost:8080/DATN/order/confirmOrder?code=${code}&user=${fullName}`, { method: 'POST' });
                if (res.ok) {
                    Swal.fire('Thành công', 'Đã xác nhận đơn hàng!', 'success');
                    fetchOrders();
                } else {
                    Swal.fire('Lỗi', 'Xác nhận đơn hàng thất bại!', 'error');
                }
            } catch (e) {
                console.error("Lỗi xác nhận đơn:", e);
                Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
            }
        }
    });
};

// Đóng gói đơn hàng
const handleTranfer = async (code) => {
    Swal.fire({
        title: 'Xác nhận đóng gói',
        text: 'Bạn có chắc chắn muốn đóng gói đơn hàng này?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Đóng gói',
        cancelButtonText: 'Thoát',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:8080/DATN/order/transfer?code=${code}`, { method: 'POST' });
                if (res.ok) {
                    Swal.fire('Thành công', 'Đã đóng gói đơn hàng, chờ chuyển giao!', 'success');
                    fetchOrders();
                } else {
                    Swal.fire('Lỗi', 'Đóng gói thất bại!', 'error');
                }
            } catch (e) {
                console.error("Lỗi đóng gói:", e);
                Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
            }
        }
    });
};

// Vận chuyển đơn hàng
const handleDelivery = async (code) => {
    Swal.fire({
        title: 'Xác nhận vận chuyển',
        text: 'Bạn có chắc chắn muốn vận chuyển đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Vận chuyển',
        cancelButtonText: 'Thoát',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:8080/DATN/order/delivery?code=${code}`, { method: 'POST' });
                if (res.ok) {
                    Swal.fire('Thành công', 'Đã chuyển giao cho đơn vị vận chuyển!', 'success');
                    fetchOrders();
                } else {
                    Swal.fire('Lỗi', 'Chuyển giao thất bại!', 'error');
                }
            } catch (e) {
                console.error("Lỗi vận chuyển:", e);
                Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
            }
        }
    });
};

const handleConfirm = async (code) => {
    Swal.fire({
        title: 'Xác nhận giao hàng',
        text: 'Bạn có chắc chắn giao hàng thành công không?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Chắc chắn',
        cancelButtonText: 'Không',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:8080/DATN/order/receive?code=${code}`, { method: 'POST' });
                if (res.ok) {
                    Swal.fire('Thành công', 'Đã  giao hàng thành công!', 'success');
                    fetchOrders();
                } else {
                    Swal.fire('Lỗi', 'Giao hàng thất bại!', 'error');
                }
            } catch (e) {
                console.error("Lỗi giao hàng:", e);
                Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
            }
        }
    });
};

const handleReturnProduct = async (code) => {
    Swal.fire({
        title: 'Xác nhận đơn hàng về kho',
        text: 'Bạn có chắc chắn đơn hàng ã về kho không?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Chắc chắn',
        cancelButtonText: 'Không',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:8080/DATN/order/returnToStock?code=${code}`, { method: 'POST' });
                if (res.ok) {
                    Swal.fire('Thành công', 'Đơn hàng đã về kho', 'success');
                    fetchOrders();
                } else {
                    Swal.fire('Lỗi', 'Đơn hàng chưa về được kho!', 'error');
                }
            } catch (e) {
                console.error("Lỗi vận chuyển :", e);
                Swal.fire('Lỗi', 'Lỗi kết nối server!', 'error');
            }
        }
    });
};
const statusFilter = document.getElementById("statusFilter");
const filterBtn = document.getElementById("filterBtn");


statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderOrders(filteredOrders());
});

filterBtn.addEventListener("click", () => {
    currentPage = 1;
    renderOrders(filteredOrders());
});
window.addEventListener("DOMContentLoaded", fetchOrders);
