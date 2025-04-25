function generateNextCode(existingCodes) {
    let maxNumber = 0;

    existingCodes.forEach(code => {
        const match = code.match(/^B(\d{3})$/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) {
                maxNumber = num;
            }
        }
    });

    const nextNumber = maxNumber + 1;
    return `B${nextNumber.toString().padStart(3, '0')}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
        // Trường hợp thêm mới → sinh code mới
        fetch("http://localhost:8080/DATN/brand/findAll") // hoặc API bạn đang có
            .then(res => res.json())
            .then(result => {
                const codes = result.data.map(d => d.code);
                const newCode = generateNextCode(codes);
                document.getElementById("code").value = newCode;
            })
            .catch(err => {
                console.error(err);
                alert("Không thể sinh mã khuyến mãi mới.");
            });
        return;
    }

    fetch(`http://localhost:8080/DATN/brand/detail?code=${code}`)
        .then(res => res.json())
        .then(resData => {
            const data = resData.data; // 👈 lấy object thật từ resData.data

            document.getElementById("brandId").textContent = data.id;
            document.getElementById("name").value = data.name;
            document.getElementById("code").value = data.code;
            document.getElementById("email").value = data.email;
            document.getElementById("phone").value   = data.phone;
            document.getElementById("address").value = data.address;
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi khi tải dữ liệu.");
        });
});

function saveBrand() {
    const idText = document.getElementById("brandId").textContent.trim();
    const codeValue = document.getElementById("code").value.trim();

    const isUpdate = idText !== "" && codeValue !== "";

    const data = {
        id: isUpdate ? parseInt(idText) : null,
        code: codeValue,
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
    };

    fetch("http://localhost:8080/DATN/brand/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert(isUpdate ? "Cập nhật thành công!" : "Thêm mới thành công!");
                window.location.href = "managerBrand.html";
            } else {
                alert(isUpdate ? "Cập nhật thất bại." : "Thêm mới thất bại.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi khi gửi dữ liệu.");
        });
}