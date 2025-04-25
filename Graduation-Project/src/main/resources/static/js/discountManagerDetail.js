function generateNextCode(existingCodes) {
    let maxNumber = 0;

    existingCodes.forEach(code => {
        const match = code.match(/^D(\d{3})$/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) {
                maxNumber = num;
            }
        }
    });

    const nextNumber = maxNumber + 1;
    return `D${nextNumber.toString().padStart(3, '0')}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
        // Trường hợp thêm mới → sinh code mới
        fetch("http://localhost:8080/DATN/discount/findAll") // hoặc API bạn đang có
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

    fetch(`http://localhost:8080/DATN/discount/detail?code=${code}`)
        .then(res => res.json())
        .then(resData => {
            const data = resData.data; // 👈 lấy object thật từ resData.data

            document.getElementById("discountId").textContent = data.id;
            document.getElementById("name").value = data.name;
            document.getElementById("code").value = data.code;
            document.getElementById("isDeleted").value = data.isDeleted.toString();

            function toLocalDateTimeValue(s) {
                return s ? s.substring(0, 16) : "";
            }

            document.getElementById("startDate").value = toLocalDateTimeValue(data.startDate);
            document.getElementById("endDate").value   = toLocalDateTimeValue(data.endDate);
            document.getElementById("type").value = data.type;
            document.getElementById("value").value = data.value;
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi khi tải dữ liệu.");
        });
});

function saveDiscount() {
    const idText = document.getElementById("discountId").textContent.trim();
    const codeValue = document.getElementById("code").value.trim();

    const isUpdate = idText !== "" && codeValue !== "";

    const data = {
        id: isUpdate ? parseInt(idText) : null,
        code: codeValue,
        name: document.getElementById("name").value.trim(),
        isDeleted: document.getElementById("isDeleted").value === "true",
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        type: parseInt(document.getElementById("type").value),
        value: parseFloat(document.getElementById("value").value),
    };

    fetch("http://localhost:8080/DATN/discount/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert(isUpdate ? "Cập nhật thành công!" : "Thêm mới thành công!");
                window.location.href = "managerDiscount.html";
            } else {
                alert(isUpdate ? "Cập nhật thất bại." : "Thêm mới thất bại.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Lỗi khi gửi dữ liệu.");
        });
}
