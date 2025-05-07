document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/DATN/auth/log-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const result = await response.json();
        if (!response.ok) {
            let errorMessage = "Tài khoản hoặc mật khẩu không đúng";

            if (result.code === 1008) {
                errorMessage = result.message;
            }

            Swal.fire({
                icon: 'error',
                text: errorMessage,
                position: 'center',
                confirmButtonText: 'OK',
            });
            return;
        }

        const token = result.data.token;

        // Giải mã token để lấy payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64));

        // Lấy role đầu tiên trong mảng
        const role = decodedPayload.roles[0];

        // Lưu thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        // Điều hướng về trang chính
        window.location.href = "/DATN/home.html";
        console.log("token", token);
        console.log("role", role);

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        Swal.fire({
            icon: 'error',
            title: 'Đã xảy ra lỗi',
            text: 'Vui lòng thử lại sau!',
        });
    }
});
