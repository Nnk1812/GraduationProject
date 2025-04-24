let selectedBrandCode = null;
let selectedDiscountCode = null;
let discountMap = {}; // Để tính giá sau giảm

// Load danh sách nhãn hàng
async function loadBrands(currentCode = null) {
    try {
        const response = await fetch('http://localhost:8080/DATN/brand/findAll');
        const result = await response.json();
        const brands = result.data;

        const select = document.getElementById('brandSelect');
        select.innerHTML = `<option value="">-- Chọn nhãn hàng --</option>`;

        brands.forEach(brand => {
            if (!brand.isDeleted && brand.isActive) {
                const option = document.createElement('option');
                option.value = brand.code;
                option.textContent = brand.name;
                if (brand.code === currentCode) {
                    option.selected = true;
                    selectedBrandCode = brand.code;
                }
                select.appendChild(option);
            }
        });

        select.addEventListener('change', (e) => {
            selectedBrandCode = e.target.value;
        });
    } catch (err) {
        console.error('Lỗi khi gọi API brand:', err);
    }
}

// Load danh sách mã giảm giá
async function loadDiscounts(currentCode = null) {
    try {
        const response = await fetch('http://localhost:8080/DATN/discount/findAll');
        const result = await response.json();
        const discounts = result.data;

        const select = document.getElementById('discountSelect');
        select.innerHTML = `<option value="">-- Chọn giảm giá --</option>`;
        discountMap = {};

        discounts.forEach(discount => {
            if (!discount.isDeleted && discount.isActive && discount.type === 1) {
                const option = document.createElement('option');
                option.value = discount.code;
                option.textContent = `Mã: ${discount.code} - Giảm: ${discount.value}%`;
                if (discount.code === currentCode) {
                    option.selected = true;
                    selectedDiscountCode = discount.code;
                }
                discountMap[discount.code] = discount.value;
                select.appendChild(option);
            }
        });

        select.addEventListener('change', (e) => {
            selectedDiscountCode = e.target.value;
            calculateRealPrice();
        });
    } catch (err) {
        console.error('Lỗi khi gọi API discount:', err);
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
        alert("Không tìm thấy mã sản phẩm!");
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
            document.getElementById("productType").value = data.type;
            document.getElementById("description").value = data.description;

            document.getElementById("material").value = data.material;
            document.getElementById("strapMaterial").value = data.strapMaterial;
            document.getElementById("movementType").value = data.movementType;
            document.getElementById("waterResistance").value = data.waterResistance;
            document.getElementById("dialSize").value = data.dialSize;
            document.getElementById("origin").value = data.origin;
            console.log(data.description);
            console.log(data.material);
            await Promise.all([
                loadBrands(data.brandCode),
                loadDiscounts(data.discountCode)
            ]);

            calculateRealPrice();
        } else {
            alert("Không tìm thấy sản phẩm!");
        }
    } catch (err) {
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

// Lưu thông tin sản phẩm
async function saveProduct() {
    const product = {
        id: parseInt(document.getElementById("productId").value, 10),
        code: document.getElementById("code").value,
        name: document.getElementById("name").value,
        price: parseFloat(document.getElementById("price").value),
        realPrice: parseFloat(document.getElementById("realPrice").value),
        image: document.getElementById("image").value,
        type: parseInt(document.getElementById("productType").value),
        brand: selectedBrandCode,
        discount: selectedDiscountCode,
        description: document.getElementById("description").value,
        material: document.getElementById("material").value,
        strapMaterial: document.getElementById("strapMaterial").value,
        movementType: document.getElementById("movementType").value,
        waterResistance: document.getElementById("waterResistance").value,
        dialSize: document.getElementById("dialSize").value,
        origin: document.getElementById("origin").value
    };
    try {
        const res = await fetch('http://localhost:8080/DATN/products/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        const result = await res.json();
        if (result.code === 200) {
            alert("Cập nhật sản phẩm thành công!");
            window.location.href = "managerProduct.html";
        } else {
            alert("Cập nhật thất bại: " + result.message);
        }
    } catch (err) {
        alert("Lỗi khi lưu: " + err.message);
    }
}

document.addEventListener('DOMContentLoaded', loadProductFromAPI);
