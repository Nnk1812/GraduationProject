let allProducts = [];
const username = localStorage.getItem("username");
let fullname = "";


let userData = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/findUser?user=${username}`);
        const json = await res.json();
        if (json.code === 200) {
            userData = json.data;
            console.log(userData);
            console.log(username);

            fullname = userData.fullName;
            console.log(fullname);
        } else {
            console.error("Không tìm thấy người dùng:", json.message);
        }
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
    }
});

function formatCurrency(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
function generateNextCode(existingCodes) {
    let maxNumber = 0;

    existingCodes.forEach(code => {
        const match = code.match(/^W(\d{3})$/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) {
                maxNumber = num;
            }
        }
    });

    const nextNumber = maxNumber + 1;
    return `W${nextNumber.toString().padStart(3, '0')}`;
}
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    await loadDiscounts();
    await loadAllProducts();
    if (!code) {
        document.getElementById("h1").textContent = "Thêm mới phiếu nhập kho";
        document.getElementById("employee").value = fullname;
        fetch("http://localhost:8080/DATN/warehouse/findAll") // hoặc API bạn đang có
            .then(res => res.json())
            .then(result => {
                const codes = result.data.map(d => d.code);
                const newCode = generateNextCode(codes);
                document.getElementById("code").value = newCode;
                const tbody = document.getElementById("productTable");
                tbody.innerHTML = "";
                updateRowNumbers();
                updateGrandTotal();
                addProductRow();
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể sinh mã mới',
                });
            });
        return;
    }

    await loadWarehouseDetail(code);
});

async function loadAllProducts() {
    try {
        const res = await fetch("http://localhost:8080/DATN/products/getAll");
        const json = await res.json();
        if (json.code === 200) {
            allProducts = json.data || [];
            console.log(allProducts);
        } else {
            console.error("Không thể tải danh sách sản phẩm:", json.message);
        }
    } catch (error) {
        console.error("Lỗi khi gọi API sản phẩm:", error);
    }
}

async function loadDiscounts() {
    try {
        const res = await fetch("http://localhost:8080/DATN/discount/findAll");
        const json = await res.json();

        if (json.code === 200) {
            const now = new Date();
            const validDiscounts = json.data.filter(discount => {
                const start = new Date(discount.startDate);
                const end = new Date(discount.endDate);
                return discount.isActive && !discount.isDeleted && start <= now && now <= end;
            });

            window.validDiscounts = validDiscounts;

            const discountSelect = document.getElementById("discountSelect");
            validDiscounts.forEach(discount => {
                const option = document.createElement("option");
                option.value = discount.code;
                option.textContent = `${discount.name} - ${discount.code}`;
                discountSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Lỗi khi gọi API giảm giá:", error);
    }
}

async function loadWarehouseDetail(code) {
    try {
        const res = await fetch(`http://localhost:8080/DATN/warehouse/detail?code=${code}`);
        const json = await res.json();

        if (json.code !== 200 || !json.data) {
            return Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không tìm thấy dữ liệu phiếu nhập',
            });
        }

        const data = json.data;
        const isEditable = data.status === 1;
        const isReadonly = data.status === 3;

        const deleteTh = document.querySelector("#productTable thead th:last-child");
        if (deleteTh) deleteTh.style.display = isEditable ? "table-cell" : "none";

        const addBtn = document.getElementById("addProductBtn");
        if (addBtn) addBtn.style.display = isEditable ? "inline-block" : "none";

        if (isReadonly) {
            const allButtons = document.querySelectorAll("button:not(#backBtn)");
            allButtons.forEach(btn => {
                if (btn.id !== "backBtn") btn.style.display = "none";
            });
        }
        document.getElementById("reportImportWarehouseId").textContent = data.id;
        document.getElementById("reportName").textContent = data.code;
        document.getElementById("code").value = data.code;
        document.getElementById("name").value = data.name;
        document.getElementById("importDate").value = data.importDate.slice(0, 16);
        document.getElementById("note").value = data.note || "";
        document.getElementById("employee").value = data.employee;
        document.getElementById("discountSelect").value = data.discount || "";
        document.getElementById("status").value = data.status;
        document.getElementById("price").value = data.price;
        document.getElementById("realPrice").value = data.realPrice;

        const inputs = document.querySelectorAll("#code, #name, #importDate, #discountSelect, #price, #realPrice, #note");
        const inputss = document.querySelectorAll("#status");
        inputs.forEach(input => {
            input.disabled = !isEditable;
            if (!isEditable) {
                input.classList.add("bg-gray-100");
            }
        });
        inputss.forEach(input => {
            input.disabled = isReadonly;
            if (isReadonly) {
                input.classList.add("bg-gray-100");
            }
        });
        document.querySelector("#productTable").innerHTML = "";

        data.products.forEach((item, index) => {
            const row = createProductRow({
                index,
                product: item.product,
                name: item.name,
                brand: item.brand,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice,
                discount: item.discount,
                realPrice: item.realPrice,
                isEditable,
                warehouseProductId: item.id,
                reportImportWarehouse: item.reportImportWarehouse
            });
            document.getElementById("productTable").appendChild(row);
        });

        updateRowNumbers();
        updateGrandTotal();

    } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Có lỗi xảy ra khi tải dữ liệu',
        });
    }
}

function createProductRow({
                              index,
                              product = "",
                              name = "",
                              brand = "",
                              quantity = 1,
                              price = 0,
                              totalPrice = 0,
                              discount = "",
                              realPrice = 0,
                              isEditable = true,
                              warehouseProductId = "",
                              reportImportWarehouse = ""
                          } = {}) {
    const row = document.createElement("tr");
    row.classList.add("text-center", "border-t");
    row.innerHTML = `
        <input type="hidden" name="warehouseProductId" value="${warehouseProductId}" />
        <input type="hidden" name="reportImportWarehouse" value="${reportImportWarehouse}" />
        <td class="px-4 py-2 stt">${index + 1}</td>
        <td class="px-4 py-2">
        <select class="productCode w-full border p-1 rounded" ${!isEditable ? 'disabled' : ''}>
            <option value="">-- Chọn sản phẩm --</option>
            ${allProducts.map(p => `<option value="${p.code}" ${p.code === product ? 'selected' : ''}>${p.code}</option>`).join('')}
        </select>
        </td>
        <td class="px-4 py-2">
            <input type="text" name="productName" class="productName w-32 border p-1 rounded" value="${name}" readonly />
        </td>
        <td class="px-4 py-2">
            <input type="text" name="brand" class="brand w-16 border p-1 rounded" value="${brand}" readonly />
        </td>
        <td class="px-4 py-2">
            <input type="number" name="quantity" class="quantity w-12 border p-1 rounded" value="${quantity}" min="1" ${!isEditable ? 'disabled' : ''}/>
        </td>
        <td class="px-4 py-2">
            <input type="number" name="price" class="price w-full border p-1 rounded" value="${price}" ${!isEditable ? 'disabled' : ''}/>
        </td>
        <td class="px-4 py-2 totalPrice">${formatCurrency(totalPrice)}</td>
        <td class="px-4 py-2">
            <select class="discountSelectProduct w-full border rounded px-1 py-1" ${!isEditable ? 'disabled' : ''}>
                <option value="">-- Chọn mã giảm giá --</option>
                ${window.validDiscounts?.map(dis => `<option value="${dis.code}" ${dis.code === discount ? 'selected' : ''}>${dis.name} - ${dis.code}</option>`).join("")}
            </select>
        </td>
        <td class="px-4 py-2 realPrice">${formatCurrency(realPrice)}</td>
        <td class="px-4 py-2">
            ${isEditable ? '<button type="button" class="text-red-600 font-bold remove-btn">Xoá</button>' : ''}
        </td>
    `;
    if (isEditable)
    {
        updateRowEvent(row);
        updateTotal(row);
    }
    return row;
}

function addProductRow() {
    const row = createProductRow({ index: document.querySelectorAll("#productTable tr").length });
    document.getElementById("productTable").appendChild(row);
    updateRowNumbers();
    updateGrandTotal();
}

function updateRowEvent(row) {
    const productSelect = row.querySelector(".productCode");
    const quantityInput = row.querySelector(".quantity");
    const priceInput = row.querySelector(".price");
    const removeBtn = row.querySelector(".remove-btn");

    productSelect.addEventListener("change", () => {
        const selectedCode = productSelect.value;
        const product = allProducts.find(p => p.code === selectedCode);
        if (product) {
            row.querySelector(".productName").value = product.productName || product.name;
            row.querySelector(".brand").value = product.brandName || "";
            // row.querySelector(".price").value = product.price;
            updateTotal(row);
        }
    });

    quantityInput.addEventListener("input", () => updateTotal(row));
    priceInput.addEventListener("input", () => updateTotal(row));
    removeBtn?.addEventListener("click", () => {
        row.remove();
        updateRowNumbers();
        updateGrandTotal();
    });
}

function updateRowNumbers() {
    document.querySelectorAll("#productTable tr").forEach((row, index) => {
        const cell = row.querySelector(".stt");
        if (cell) cell.textContent = index + 1;
    });
}

function updateTotal(row) {
    const q = parseInt(row.querySelector(".quantity").value) || 0;
    const p = parseFloat(row.querySelector(".price").value) || 0;
    const total = q * p;

    row.querySelector(".totalPrice").textContent = formatCurrency(total);
    row.querySelector(".realPrice").textContent = formatCurrency(total); // Sẽ xử lý logic giảm giá sau nếu cần

    updateGrandTotal();
}

function updateGrandTotal() {
    let sum = 0;
    document.querySelectorAll("#productTable .realPrice").forEach(cell => {
        const num = parseInt(cell.textContent.replace(/[^\d]/g, '')) || 0;
        sum += num;
    });
    let price = sum + sum*10/100;
    document.getElementById("price").value = price;
    document.getElementById("realPrice").value = price;
}


function saveReport() {
    const rows = document.querySelectorAll("#productTable tr");
    const products = [];
    let isValid = true;

    const hasInvalid = Array.from(rows).some(row => {
        const warehouseProductId = row.querySelector('input[name="warehouseProductId"]')?.value || null;
        const reportImportWarehouse = row.querySelector('input[name="reportImportWarehouse"]')?.value || null;
        const productCode = row.querySelector('.productCode')?.value?.trim();
        const productName = row.querySelector('input[name="productName"]')?.value?.trim();
        const brand = row.querySelector('input[name="brand"]')?.value?.trim();
        const quantityValue = row.querySelector('input[name="quantity"]')?.value;
        const priceValue = row.querySelector('input[name="price"]')?.value;

        const quantity = parseFloat(quantityValue);
        const price = parseFloat(priceValue);

        const discountCode = row.querySelector('.discountSelectProduct')?.value || null;

        if (!productCode || !productName || isNaN(quantity) || isNaN(price)) {
            isValid = false;
            return true; // Dừng lại nếu có dòng sai
        }

        const isCreate = document.getElementById("reportImportWarehouseId").textContent.trim();

        if (isCreate) {
            products.push({
                id: warehouseProductId,
                reportImportWarehouse: reportImportWarehouse,
                product: productCode,
                name: productName,
                brand: brand,
                quantity: quantity,
                price: price,
                discount: discountCode
            });
        } else {
            products.push({
                product: productCode,
                quantity: quantity,
                price: price,
                discount: discountCode
            });
        }

        return false;
    });

    if (hasInvalid) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng nhập đầy đủ thông tin sản phẩm (mã, tên, số lượng, đơn giá).',
        });
        return;
    }

    const reportId = document.getElementById("reportImportWarehouseId").textContent.trim();
    const isCreate = !reportId || reportId === "" || reportId === "null";

    const payload = {
        id: reportId || null,
        name: document.getElementById("name").value,
        importDate: document.getElementById("importDate").value,
        note: document.getElementById("note").value,
        employee: document.getElementById("employee").value,
        discount: document.getElementById("discountSelect").value,
        status: document.getElementById("status").value,
        products: products
    };

    if (!isCreate) {
        payload.code = document.getElementById("code").value;
    }

    console.log("Dữ liệu gửi lên server:", payload);

    fetch("http://localhost:8080/DATN/warehouse/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(json => {
            if (json.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: isCreate ? 'Thêm mới phiếu nhập thành công!' : 'Cập nhật phiếu nhập thành công!',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "/DATN/pages/managerReportImportWarehouse.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi tải dữ liệu',
                });
            }
        })
        .catch(err => {
            console.error("Lỗi:", err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi kết nối server!',
            });
        });
}


