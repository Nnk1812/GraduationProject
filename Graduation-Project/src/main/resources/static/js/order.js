const user = localStorage.getItem("username");

const renderOrders = (orders) => {
    const orderContainer = document.getElementById('orderContainer');
    orderContainer.innerHTML = ''; // Xóa cũ

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = "bg-white rounded-xl shadow-md p-6 mb-6";

        let productsHtml = '';

        order.orderDetails.forEach(product => {
            productsHtml += `
                <div class="flex items-center mb-4">
                    <img src="${product.image}" alt="Product Image" class="w-20 h-20 rounded-lg object-cover mr-4">
                    <div class="flex-1">
                        <div class="font-semibold text-gray-800">${product.name}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Số lượng: ${product.quantity}</div>
                        ${
                product.price !== product.totalPrice
                    ? `
                                <div>
                                    <span class="line-through text-gray-400 text-sm">${formatCurrency(product.price)}</span><br>
                                    <span class="text-red-600 font-bold">${formatCurrency(product.totalPrice)}</span>
                                </div>
                            `
                    : `
                                <span class="text-red-600 font-bold">${formatCurrency(product.totalPrice)}</span>
                            `
            }
                    </div>
                </div>
            `;
        });

        orderDiv.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-gray-700">
                    Mã đơn: ${order.code}
                </div>
                <div class="text-sm font-bold ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-blue-600'}">
                    ${convertOrderStatus(order.status)}
                </div>
            </div>
            ${productsHtml}
            <button onclick="viewOrderDetail('${order.code}')" class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Xem
            </button>
        `;

        orderContainer.appendChild(orderDiv);
    });
};


const loadOrders = async () => {
    try {
        const response = await fetch(`http://localhost:8080/DATN/order/findByCode?code=${user}`);
        const orders = await response.json();
        console.log(orders.data);
        renderOrders(orders.data);

    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
    }
};

const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN') + '₫';
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

const viewOrderDetail = (code) => {
    window.location.href = `/DATN/pages/orderDetail.html?code=${code}`;
};

loadOrders();
