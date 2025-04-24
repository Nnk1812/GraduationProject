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
            alert('Đăng ký thành công!');
            document.getElementById('register-form').reset();
        } else {
            const err = await response.json();
            alert('Lỗi: ' + (err.message || 'Không xác định'));
        }
    } catch (error) {
        alert('Lỗi kết nối tới máy chủ!');
        console.error(error);
    }
});