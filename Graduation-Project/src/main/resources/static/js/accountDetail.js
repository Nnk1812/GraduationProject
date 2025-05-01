document.addEventListener("DOMContentLoaded", function() {
    const user = localStorage.getItem("username");

    fetch( `http://localhost:8080/DATN/user/findUser?user=${user}`)
        .then(response => response.json())
        .then(result => {
            if (result.code === 200 && result.data) {
                const userData = result.data;
                document.getElementById('changePasswordBtn').addEventListener('click', function() {
                    window.location.href = `/DATN/pages/changePassword.html?code=${userData.code}`;
                });
                // Gán dữ liệu vào form
                document.getElementById('accountId').value = userData.id;
                document.getElementById('accountCode').value = userData.code || '';
                document.getElementById('accountPassword').value = userData.passWord || '';
                document.getElementById('username').value = userData.userName || '';
                document.getElementById('fullname').value = userData.fullName || '';
                document.getElementById('accountRole').value = userData.role || '';
                document.getElementById('accountDateout').value = (userData.dateOut ? userData.dateOut.slice(0, 16) : '') || '';
                document.getElementById('email').value = userData.email || '';
                document.getElementById('phone').value = userData.phone || '';
                document.getElementById('address').value = userData.address || '';

                // Gán giới tính
                if (userData.sex.toLowerCase() === 'male') {
                    document.getElementById('gender_male').checked = true;
                } else if (userData.sex.toLowerCase() === 'female') {
                    document.getElementById('gender_female').checked = true;
                }
            } else {
                console.error('Không lấy được dữ liệu người dùng.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi gọi API:', error);
        });
});

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const updatedData = {
        id: document.getElementById('accountId').value,
        code: document.getElementById('accountCode').value,
        userName: document.getElementById('username').value,
        passWord: document.getElementById('accountPassword').value,
        role: document.getElementById('accountRole').value,
        dateOut: document.getElementById('accountDateout').value,
        fullName: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        sex: document.querySelector('input[name="gender"]:checked')?.value
    };

    console.log('Dữ liệu gửi:', updatedData);

    fetch('http://localhost:8080/DATN/user/saveUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(data => {
            if (data.code === 200) {
                alert('Cập nhật thành công!');
            } else {
                alert('Có lỗi xảy ra khi cập nhật.');
            }
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật:', error);
            alert('Có lỗi xảy ra.');
        });
});