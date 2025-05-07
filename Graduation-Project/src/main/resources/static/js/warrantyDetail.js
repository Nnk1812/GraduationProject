const typeMap = {
    1: "Đồng hồ đeo tay nam",
    2: "Đồng hồ đeo tay nữ",
    3: "Đồng hồ treo tường"
};

const statusMap = {
    1: "Chờ xác nhận",
    2: "Đã tiếp nhận",
    3: "Đang xử lý",
    4: "Đã hoàn thành",
    5: "Bảo hành thành công",
    6: "Từ chối bảo hành"
};
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

fetch(`http://localhost:8080/DATN/warranty/detail?code=${code}`)
    .then(res => res.json())
    .then(async  res => {
        const data = res.data;
        let employee = await getFullNameFromCode(data.employee);
        let customer = data.customer ? await getFullNameFromCode(data.employee) :'N/A';


        document.getElementById("order").textContent = data.order;
        document.getElementById("product").textContent = data.product;
        document.getElementById("productName").textContent = data.productName;
        document.getElementById("type").textContent = typeMap[data.type] ?? "Không xác định";

        document.getElementById("code").textContent = data.code;
        document.getElementById("employee").textContent = employee;
        document.getElementById("customer").textContent = customer;
        document.getElementById("status").textContent = statusMap[data.status] ?? "Không xác định";
        document.getElementById("quantity").textContent = data.quantity ?? "N/A";
        document.getElementById("warrantyDate").textContent = formatDate(data.warrantyDate);
        document.getElementById("completeDate").textContent = data.completeDate ? formatDate(data.completeDate) : "N/A";
        document.getElementById("brandName").textContent = data.brandName;
        if (data.status === 4) {
            document.getElementById("confirmReturnBtn").classList.remove("hidden");
        }

    });

// Hàm lấy fullName từ mã nhân viên
async function getFullNameFromCode(code) {
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/detail?code=${code}`);
        if (!res.ok) {
            return 'N/A';
        }
        const json = await res.json();
        return json.data?.fullName ?? 'N/A';
    } catch (err) {
        console.error("Lỗi khi gọi API người dùng:", err);
        return code + " (Lỗi)";
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}
async function confirmReturn() {
    const confirmResult = await Swal.fire({
        title: "Xác nhận trả hàng?",
        text: "Bạn chắc chắn đã trả hàng cho khách?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy"
    });

    if (confirmResult.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:8080/DATN/warranty/returned?code=${code}`, {
                method: "POST"
            });
            const result = await res.json();

            if (result.code === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: result.data,
                    confirmButtonText: "OK"
                });
                location.reload();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Thất bại",
                    text: result.data || "Có lỗi xảy ra"
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể xác nhận trả hàng"
            });
        }
    }
}


