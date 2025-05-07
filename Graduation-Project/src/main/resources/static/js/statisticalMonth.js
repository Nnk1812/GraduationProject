const revenueTableBody = document.getElementById("revenueTableBody");
const yearInput = document.getElementById("yearInput");
const loadDataBtn = document.getElementById("loadDataBtn");
let chart;

async function loadRevenueData(year) {
    try {
        const response = await fetch(`http://localhost:8080/DATN/order/monthlyIncome?year=${year}`);
        const json = await response.json();
        const data = json.data;

        // Render bảng
        revenueTableBody.innerHTML = "";
        for (let i = 1; i <= 12; i++) {
            const monthData = data.find(d => d.month === i);
            const total = monthData?.totalIncome ?? 0;

            revenueTableBody.innerHTML += `
          <tr>
            <td class="px-4 py-2">Tháng ${i}</td>
            <td class="px-4 py-2">${total.toLocaleString()} đ</td>
          </tr>`;
        }

        const chartData = data.map(d => d.totalIncome);
        const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
        if (chart) chart.destroy();
        chart = new Chart(document.getElementById("revenueChart"), {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: `Doanh thu năm ${year}`,
                    data: chartData,
                    backgroundColor: "rgba(59, 130, 246, 0.7)",
                    borderColor: "rgba(59, 130, 246, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (val) => val.toLocaleString() + " đ"
                        }
                    }
                }
            }
        });

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể tải dữ liệu. ',
            confirmButtonText: 'Đã hiểu'
        });
    }
}


loadDataBtn.addEventListener("click", () => {
    const year = parseInt(yearInput.value);
    if (!isNaN(year)) loadRevenueData(year);
});


loadRevenueData(parseInt(yearInput.value));