const username = localStorage.getItem("username");

function openModal() {
    document.getElementById('warrantyModal').classList.remove('hidden');

}

function closeModal() {
    document.getElementById('warrantyModal').classList.add('hidden');
}

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("warranty");

    const statusMap = {
        1: "Chờ xác nhận",
        2: "Đã tiếp nhận",
        3: "Đang xử lý",
        4: "Đã hoàn thành",
        5: "Đã hoàn thành bảo hành và trả hàng",
        6: "Từ chối bảo hành"
    };

    try {
        const code = await getUserCode(username);
        const response = await fetch(`http://localhost:8080/DATN/warranty/findByUsername?code=${code}`);
        const result = await response.json();
        const warranties = result.data;

        warranties.forEach((item) => {
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded shadow-md";

            card.innerHTML = `
  <div class="flex justify-between mb-2">
    <span class="font-semibold text-blue-600">Mã: ${item.code}</span>
    <span class="text-sm text-gray-600">${statusMap[item.status]}</span>
  </div>
  <div class="flex gap-4">
    <img src="${item.image}" alt="Product" class="w-32 h-32 object-cover rounded border" />
    <div class="flex-1">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-lg font-semibold">${item.productName}</h2>
          <p class="text-sm"><strong>Số lượng:</strong> ${item.quantity ?? 'N/A'}</p>
        </div>
        <div class="text-sm text-right text-gray-700">
          <p><strong>Người phụ trách:</strong> ${item.employee ? item.employee : 'N/A'}  </p>
          <p><strong>SĐT:</strong> ${item.sdt ? item.sdt : 'N/A'}</p>
          <p><strong>Ngày nhận:</strong> ${new Date(item.receive_date).toLocaleString()}</p>
          <p><strong>Ngày hoàn thành:</strong> ${item.complete_date ? new Date(item.complete_date).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-4">
    <a href="warrantyDetail.html?code=${item.code}" class="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
      Xem chi tiết
    </a>
  </div>
`;




            container.appendChild(card);
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu bảo hành:", error);
        container.innerHTML = `<p class="text-red-500">Không thể tải dữ liệu phiếu bảo hành.</p>`;
    }
});

async function getUserCode(userName) {
    try {
        const response = await fetch(`http://localhost:8080/DATN/user/findUser?user=${userName}`);
        const result = await response.json();

        if (result.code === 200 && result.data && result.data.code) {
            return result.data.code; // Trả về mã nhân viên/khách hàng
        } else {
            console.warn("Không tìm thấy mã người dùng.");
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi lấy mã người dùng:", error);
        return null;
    }
}

document.getElementById("warrantyForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const order = document.getElementById("orderCode").value.trim();
    const product = document.getElementById("productCode").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);

    const customer = await getUserCode(username); // ví dụ

    const data = {
        order,
        product,
        quantity,
        customer
    };

    try {
        const response = await fetch("http://localhost:8080/DATN/warranty/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json(); // Luôn parse JSON để lấy thông tin lỗi nếu có

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Yêu cầu bảo hành đã được gửi!',
                confirmButtonText: 'Đóng'
            }).then(() => {
                closeModal();
                document.getElementById("warrantyForm").reset();
                // Optional: load lại danh sách yêu cầu bảo hành
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: result.message || 'Không thể gửi yêu cầu. Vui lòng thử lại!'
            });
        }
    } catch (error) {
        console.error("Lỗi:", error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi hệ thống',
            text: 'Đã xảy ra lỗi khi gửi yêu cầu.'
        });
    }
});
