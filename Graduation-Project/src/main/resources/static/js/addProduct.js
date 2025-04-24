// Lưu dữ liệu khi người dùng nhập
function saveFormToLocalStorage() {
    const formData = {
        productName: document.getElementById('productName').value,
        brandSelect: document.getElementById('brandSelect').value,
        quantity: document.getElementById('quantity').value,
        price: document.getElementById('price').value,
        discountSelect: document.getElementById('discountSelect').value,
        productType: document.getElementById('productType').value,
        imageUrl: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
        caseMaterial: document.getElementById('caseMaterial').value,
        strapMaterial: document.getElementById('strapMaterial').value,
        movementType: document.getElementById('movementType').value,
        waterResistance: document.getElementById('waterResistance').value,
        dialSize: document.getElementById('dialSize').value,
        origin: document.getElementById('origin').value
    };
    localStorage.setItem('productFormData', JSON.stringify(formData));
}

// Khôi phục dữ liệu từ localStorage khi load trang
window.addEventListener('DOMContentLoaded', () => {
    const savedData = JSON.parse(localStorage.getItem('productFormData'));
    if (savedData) {
        document.getElementById('productName').value = savedData.productName || '';
        document.getElementById('brandSelect').value = savedData.brandSelect || '';
        document.getElementById('quantity').value = savedData.quantity || '';
        document.getElementById('price').value = savedData.price || '';
        document.getElementById('discountSelect').value = savedData.discountSelect || '';
        document.getElementById('productType').value = savedData.productType || '';
        document.getElementById('imageUrl').value = savedData.imageUrl || '';
        document.getElementById('description').value = savedData.description || '';
        document.getElementById('caseMaterial').value = savedData.caseMaterial || '';
        document.getElementById('strapMaterial').value = savedData.strapMaterial || '';
        document.getElementById('movementType').value = savedData.movementType || '';
        document.getElementById('waterResistance').value = savedData.waterResistance || '';
        document.getElementById('dialSize').value = savedData.dialSize || '';
        document.getElementById('origin').value = savedData.origin || '';
    }
});

// Gắn sự kiện input để lưu dữ liệu
setTimeout(() => {
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', saveFormToLocalStorage);
    });
}, 100);

async function loadDiscounts() {
    try {
        const response = await fetch('http://localhost:8080/DATN/discount/findAll');
        const result = await response.json();
        const discounts = result.data;

        const select = document.getElementById('discountSelect');

        discounts.forEach(discount => {
            if (!discount.isDeleted && discount.isActive && discount.type === 1) {
                const option = document.createElement('option');
                option.value = discount.code;
                option.textContent = `Mã giảm giá: ${discount.code} - Giảm: ${discount.value}%`;
                select.appendChild(option);
            }
        });
    } catch (err) {
        console.error('Lỗi khi gọi API discount:', err);
    }
}
document.addEventListener('DOMContentLoaded', loadDiscounts);

let selectedBrandCode = null;

async function loadBrands() {
    try {
        const response = await fetch('http://localhost:8080/DATN/brand/findAll');
        const result = await response.json();
        const brands = result.data;

        const select = document.getElementById('brandSelect');

        brands.forEach(brand => {
            if (!brand.isDeleted && brand.isActive) {
                const option = document.createElement('option');
                option.value = brand.code;
                option.textContent = brand.name;
                select.appendChild(option);
            }
        });

        select.addEventListener('change', (e) => {
            selectedBrandCode = e.target.value;
            console.log("Mã code nhãn hàng được chọn:", selectedBrandCode);
        });
    } catch (err) {
        console.error('Lỗi khi gọi API brand:', err);
    }
}
document.addEventListener('DOMContentLoaded', loadBrands);

document.getElementById('submitProduct').addEventListener('click', async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        brand: document.getElementById('brandSelect').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value),
        discount: document.getElementById('discountSelect').value || null,
        description: document.getElementById('description')?.value || "",
        image: document.getElementById('imageUrl').value,
        type: parseInt(document.getElementById('productType').value),
        productDetail: {
            material: document.getElementById('caseMaterial').value,
            strapMaterial: document.getElementById('strapMaterial').value,
            movementType: document.getElementById('movementType').value,
            waterResistance: document.getElementById('waterResistance').value,
            dialSize: document.getElementById('dialSize').value,
            origin: document.getElementById('origin').value
        }
    };

    try {
        const response = await fetch('http://localhost:8080/DATN/products/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Thêm sản phẩm thành công!');
            localStorage.removeItem('productFormData');

            document.getElementById('productName').value = '';
            document.getElementById('brandSelect').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('price').value = '';
            document.getElementById('discountSelect').value = '';
            document.getElementById('productType').value = '';
            document.getElementById('imageUrl').value = '';
            document.getElementById('description').value = '';
            document.getElementById('caseMaterial').value = '';
            document.getElementById('strapMaterial').value = '';
            document.getElementById('movementType').value = '';
            document.getElementById('waterResistance').value = '';
            document.getElementById('dialSize').value = '';
            document.getElementById('origin').value = '';

            window.location.href = "/DATN/pages/managerProduct.html";
        } else {
            const errMsg = await response.text();
            alert('Lỗi khi lưu sản phẩm: ' + errMsg);
        }
    } catch (error) {
        console.error('Lỗi kết nối API:', error);
        alert('Không thể kết nối đến server!');
    }
});