document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới và xác nhận không khớp.');
        return;
    }

    fetch(`http://localhost:8080/DATN/user/changePassword?code=${code}&password=${oldPassword}&newPassword=${newPassword}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                alert('Đổi mật khẩu thành công!');
                window.location.href = '/DATN/pages/accountDetail.html';
            } else {
                alert('Đổi mật khẩu thất bại: ' + (data.message || 'Có lỗi xảy ra.'));
            }
        })
        .catch(error => {
            console.error('Lỗi khi đổi mật khẩu:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        });
});