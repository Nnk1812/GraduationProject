document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!oldPassword || !newPassword || !confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'Vui lòng điền đầy đủ thông tin.'
        });
        return;
    }

    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Mật khẩu mới và xác nhận không khớp.'
        });
        return;
    }

    fetch(`http://localhost:8080/DATN/user/changePassword?code=${code}&password=${oldPassword}&newPassword=${newPassword}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đổi mật khẩu thành công!'
                }).then(() => {
                    window.location.href = '/DATN/pages/accountDetail.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đổi mật khẩu thất bại: ' + (data.message || 'Có lỗi xảy ra.')
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi đổi mật khẩu:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi. Vui lòng thử lại.'
            });
        });
});