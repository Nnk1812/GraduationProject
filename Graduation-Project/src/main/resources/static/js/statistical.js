let isFiltering = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchData('http://localhost:8080/DATN/order/findStatistical');

    document.getElementById('filterBtn').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!startDate || !endDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: 'Vui lòng chọn cả hai ngày!',
            });
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi ngày tháng',
                text: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu!',
            });
            return;
        }

        const url = `http://localhost:8080/DATN/order/findByDate?startDate=${startDate}&endDate=${endDate}`;
        isFiltering = true; // Đánh dấu là đang lọc
        fetchData(url);
    });
});

function fetchData(apiUrl) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Có lỗi khi gọi API');
            return response.json();
        })
        .then(result => {
            const data = result.data;

            document.getElementById('totalOrders').textContent = data.sumOrder ?? 0;
            document.getElementById('totalRevenue').textContent = formatCurrency(data.revenue ?? 0);
            document.getElementById('successfulOrders').textContent = data.successOrder ?? 0;
            document.getElementById('canceledOrders').textContent = data.failedOrder ?? 0;
            document.getElementById('returnProduct').textContent = data.failedOrder ?? 0;

            if (isFiltering) {
                Swal.fire({
                    icon: 'success',
                    title: 'Lọc thành công',
                    showConfirmButton: false,
                    timer: 1000
                });
                isFiltering = false;
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi API',
                text: 'Không thể tải dữ liệu từ API',
            });
        });
}

function formatCurrency(number) {
    return number.toLocaleString('vi-VN') + 'đ';
}
