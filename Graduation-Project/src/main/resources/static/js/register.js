document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        userName: document.getElementById('username').value,
        passWord: document.getElementById('password').value,
        fullName: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        sex: document.querySelector('input[name="gender"]:checked').value
    };

    try {
        const response = await fetch('http://localhost:8080/DATN/user/saveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Đăng ký thành công',
            });
            document.getElementById('register-form').reset();
            window.location.href = "login.html";
        } else {
            const err = await response.json();

            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi: ' + (err.message || 'Không xác định'),
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Lỗi kết nối server!',
        });
        console.error(error);
    }
});