document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy code tài khoản từ URL ?code=...
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
        alert("Không tìm thấy mã tài khoản!");
        return;
    }

    // 2. Gọi API load chi tiết
    fetchAccountDetail(code);
});

async function fetchAccountDetail(code) {
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/detail?code=${code}`);
        const result = await res.json();

        const data = result.data;
        console.log(data)
        // Kiểm tra nếu data có giá trị trước khi gán vào form
        if (data) {
            document.getElementById("accountId").textContent = data.id || "";
            document.getElementById("code").value       = data.code || "";
            document.getElementById("email").value      = data.email || "";
            document.getElementById("full_name").value  = data.fullName || "";
            document.getElementById("password").value   = data.passWord || "";
            document.getElementById("phone").value      = data.phone || "";
            document.getElementById("username").value   = data.userName || "";
            document.getElementById("sex").value        = data.sex || "";
            document.getElementById("address").value    = data.address || "";

            // Gán giá trị vào các input date nếu có
            if (data.dateIn)  document.getElementById("date_in").value  = data.dateIn.slice(0,16);
            if (data.dateOut) document.getElementById("date_out").value = data.dateOut.slice(0,16);

            // Kiểm tra vai trò và gán cho dropdown
            const roleSelect = document.getElementById("role");
            if (roleSelect) {
                roleSelect.value = data.role || "USER";

                // Khóa option ADMIN: nếu ADMIN đang được chọn thì vẫn cho hiển thị
                Array.from(roleSelect.options).forEach(option => {
                    if (option.value === "ADMIN" && option.value !== roleSelect.value) {
                        option.disabled = true;
                    }
                });
            }

        } else {
            alert("Không tìm thấy thông tin tài khoản.");
        }

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        alert("Không thể tải chi tiết tài khoản.");
    }
}

function saveAccount() {
    const idText = document.getElementById("accountId").textContent.trim();
    const codeValue = document.getElementById("code").value.trim();

    const data = {
        id: parseInt(idText),
        code: codeValue,
        fullName: document.getElementById("full_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        userName: document.getElementById("username").value.trim(),
        passWord: document.getElementById("password").value.trim(),
        sex: document.getElementById("sex").value.trim(),
        role: document.getElementById("role").value,
        dateIn: document.getElementById("date_in").value ? document.getElementById("date_in").value + ":00" : null,
        dateOut: document.getElementById("date_out").value ? document.getElementById("date_out").value + ":00" : null
    };

    console.log("Dữ liệu gửi cập nhật:", data);

    fetch("http://localhost:8080/DATN/user/saveUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert("Cập nhật thành công!");
                window.location.href = "managerAccount.html";
            } else {
                // alert("Cập nhật thất bại.");
                return res.json();

            }
        })
        .then(errorData => {
            if (errorData) {
                // Lấy thông điệp lỗi từ API
                const errorMessage = errorData.message || "Có lỗi xảy ra!";
                alert(`Lỗi: ${errorMessage}`);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi khi gửi dữ liệu.");
        });
}


