let selectedBrandCode = null;
let selectedDiscountCode = null;
let discountMap = {}; // Để tính giá sau giảm
let brandMap  = {};

async function loadDiscounts(currentCode = null) {
    try {
        const response = await fetch('http://localhost:8080/DATN/discount/findAllDiscountValid');
        const result = await response.json();
        const discounts = result.data;

        const select = document.getElementById('discountSelect');
        select.innerHTML = `<option value="">-- Chọn giảm giá --</option>`;
        discountMap = {};

        discounts.forEach(discount => {
            if (!discount.isDeleted && discount.isActive && discount.type === 1) {
                const option = document.createElement('option');
                option.value = discount.code; // Vẫn lưu code
                option.textContent = `Giảm ${discount.value}%`; // Hiển thị chỉ giá trị giảm
                if (discount.code === currentCode) {
                    option.selected = true;
                    selectedDiscountCode = discount.code;
                }
                discountMap[discount.code] = discount.value;
                select.appendChild(option);
            }
        });

        // Thêm sự kiện onchange để tính lại giá khi chọn mã giảm giá
        select.onchange = function() {
            selectedDiscountCode = select.value;
            calculateRealPrice(); // Gọi lại hàm tính giá sau khi thay đổi giảm giá
        };

        // Nếu có giá trị mặc định, tính lại giá ngay lập tức
        if (currentCode) {
            calculateRealPrice();
        }

    } catch (err) {
        console.error('Lỗi khi gọi API discount:', err);
    }
}



async function loadBrands(currentCode = null) {
    try {
        const response = await fetch('http://localhost:8080/DATN/brand/findAll');
        const result = await response.json();
        const brands = result.data;

        const select = document.getElementById('brandSelect');
        select.innerHTML = `<option value="">-- Chọn thương hiệu --</option>`;
        brandMap = {};

        brands.forEach(brand => {
            if (!brand.isDeleted && brand.isActive) {
                const option = document.createElement('option');
                option.value = brand.code; // Vẫn lưu code
                option.textContent = brand.name; // Hiển thị tên thương hiệu
                if (brand.code === currentCode) {
                    option.selected = true;
                    selectedBrandCode = brand.code;
                }
                brandMap[brand.code] = brand.name;
                select.appendChild(option);
            }
        });
        select.onchange = function() {
        selectedBrandCode = this.value;
        };
    } catch (err) {
        console.error('Lỗi khi gọi API brand:', err);
    }
}



// Tính giá sau khi áp dụng giảm giá
function calculateRealPrice() {
    const price = parseFloat(document.getElementById('price').value) || 0;
    const discountPercent = discountMap[selectedDiscountCode] || 0;
    const realPrice = price - (price * discountPercent / 100);
    document.getElementById('realPrice').value = realPrice.toFixed(0);
}

// Lấy chi tiết sản phẩm
async function loadProductFromAPI() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không tìm thấy mã sản phẩm',
        });
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/DATN/products/getDetail?code=${code}`);
        const json = await res.json();
        if (json.code === 200) {
            const data = json.data;

            document.getElementById("productName").textContent = data.productName;
            document.getElementById("productId").value = data.productId;
            document.getElementById("name").value = data.productName;
            document.getElementById("code").value = data.code;
            document.getElementById("price").value = data.price;
            document.getElementById("realPrice").value = data.realPrice;
            document.getElementById("image").value = data.img;
            document.getElementById("productType").value = data.productType;
            document.getElementById("description").value = data.description;

            document.getElementById("material").value = data.material;
            document.getElementById("strapMaterial").value = data.strapMaterial;
            document.getElementById("movementType").value = data.movementType;
            document.getElementById("waterResistance").value = data.waterResistance;
            document.getElementById("dialSize").value = data.dialSize;
            document.getElementById("origin").value = data.origin;

            await Promise.all([
                loadBrands(data.brandCode),
                loadDiscounts(data.discountCode)
            ]);

            calculateRealPrice();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không tìm thấy mã sản phẩm',
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Lỗi khi tải dữ liệu' +err.messages,
        });
    }
}


// Lưu thông tin sản phẩm
async function saveProduct() {
    const data = {
        id: document.getElementById("productId").value,
        name: document.getElementById("name").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        realPrice: document.getElementById("realPrice").value,
        image: document.getElementById("image").value,
        type: document.getElementById("productType").value,
        description: document.getElementById("description").value,
        material: document.getElementById("material").value,
        strapMaterial: document.getElementById("strapMaterial").value,
        movementType: document.getElementById("movementType").value,
        waterResistance: document.getElementById("waterResistance").value,
        dialSize: document.getElementById("dialSize").value,
        origin: document.getElementById("origin").value,
    };

    // Chỉ thêm brandCode nếu có
    if (selectedBrandCode) {
        data.brand = selectedBrandCode;
    }else{
        data.brand = "";
    }

    // Chỉ thêm discountCode nếu có
    if (selectedDiscountCode) {
        data.discount = selectedDiscountCode;
    }else
    {
        data.discount="";
    }

    try {
        const res = await fetch("http://localhost:8080/DATN/products/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (res.ok && json.code === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhập sản phẩm thành công',
            });
            window.location.href = "/DATN/pages/managerProduct.html";
        } else {
            const errorMessage = json.message || "Có lỗi xảy ra!";
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi ' + errorMessage,
            });
        }
    } catch (err) {
        console.error("Lỗi khi gửi dữ liệu:", err);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Lỗi kết nối server!',
        });
    }
}
document.addEventListener('DOMContentLoaded', loadProductFromAPI);
