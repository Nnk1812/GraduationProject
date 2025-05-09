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
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const modal = document.getElementById('forgotPasswordModal');
const cancelBtn = document.getElementById('cancelBtn');

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Quên mật khẩu clicked");
    modal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    console.log("Cancel clicked");
    modal.classList.add('hidden');
});

document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    try {
        console.log("API đang được gọi...");
        const response = await fetch(`http://localhost:8080/DATN/user/setPassword?phone=${phone}&email=${email}`);
        const result = await response.json();

        if (result.code === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Mật khẩu mới của bạn là: ${result.data}`,
                confirmButtonText: 'Đã hiểu'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Thất bại',
                text: 'Không tìm thấy tài khoản hoặc thông tin không hợp lệ!',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
            confirmButtonText: 'OK'
        });
    }

    modal.classList.add('hidden');
});
