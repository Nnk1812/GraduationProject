// orderDetail.js
const orderCode = localStorage.getItem('orderCode');

document.addEventListener('DOMContentLoaded', () => {
    // 2) Gọi API lấy chi tiết
    fetch(`http://localhost:8080/DATN/order/detail?code=${orderCode}`)
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

function renderOrder(order) {
    // Địa chỉ nhận hàng
    document.getElementById('od-customer').textContent = order.customer;
    document.getElementById('od-phone').textContent    = order.phone;
    document.getElementById('od-address').textContent  = order.address;

    // Danh sách sản phẩm
    const itemsContainer = document.getElementById('od-items');
    itemsContainer.innerHTML = ''; // reset
    order.orderDetails.forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'flex items-center space-x-4';

        // Ảnh sản phẩm (giả định path hình là /DATN/assets/images/{product}.jpg)
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.product;
        img.className = 'w-20 h-20 object-cover rounded';

        // Phần info: số lượng và giá
        const info = document.createElement('div');
        info.className = 'flex-1';

        // Số lượng (top-right)
        const qty = document.createElement('div');
        qty.className = 'flex justify-end';
        qty.textContent = `x${item.quantity}`;

        // Giá (bottom-right)
        const priceRow = document.createElement('div');
        priceRow.className = 'flex justify-end space-x-2';
        const rawPrice = parseInt(item.price, 10);
        if (rawPrice === item.totalPrice) {
            priceRow.innerHTML = `<span>${rawPrice.toLocaleString()}₫</span>`;
        } else {
            priceRow.innerHTML = `
        <span class="line-through">${rawPrice.toLocaleString()}₫</span>
        <span class="text-red-600">${item.totalPrice.toLocaleString()}₫</span>
      `;
        }

        info.append(qty, priceRow);
        wrap.append(img, info);
        itemsContainer.appendChild(wrap);
    });

    // Phí vận chuyển & thành tiền
    document.getElementById('od-shippingFee').textContent = `${order.shippingFee.toLocaleString()}₫`;
    document.getElementById('od-priceToPay').textContent  = `${order.priceToPay.toLocaleString()}₫`;

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

    // Nút Hủy / Chỉnh sửa — chỉ khi status = 1 hoặc 2
    if (order.status === 1 || order.status === 2) {
        const actions = document.getElementById('od-actions');
        actions.innerHTML = `
      <button id="cancelBtn"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Hủy đơn hàng
      </button>
      <button id="editBtn"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
        Chỉnh sửa đơn hàng
      </button>
    `;
        document.getElementById('cancelBtn').onclick = () => {
            if (confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) {
                // gọi API hủy đơn, rồi reload hoặc chuyển trang
                fetch(`http://localhost:8080/DATN/order/cancel?code=${order.code}`, {
                    method: 'POST'
                }).then(() => location.reload());
            }
        };
        document.getElementById('editBtn').onclick = () => {
            // chuyển tới trang edit (nếu bạn có)
            window.location.href = `editOrder.html?code=${order.code}`;
        };
    }

}
