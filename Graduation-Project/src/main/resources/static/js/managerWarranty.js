const pageSize = 8;
let currentPage = 1;
let allWarranties = [];

const warrantyTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");

// Chuyển trạng thái
function convertStatus(status) {
    switch (status) {
        case 1: return 'Chờ xác nhận';
        case 2: return 'Đã tiếp nhận';
        case 3: return 'Đang xử lý';
        case 4: return 'Đã hoàn thành';
        case 5: return 'Đã hoàn thành bảo hành và trả hàng';
        case 6: return 'Từ chối bảo hành';
        default: return 'Không xác định';
    }
}
const renderWarranties = async (warranties) => {
    warrantyTable.innerHTML = "";

    const startIndex = (currentPage - 1) * pageSize;
    const paginated = warranties.slice(startIndex, startIndex + pageSize);

    for (let index = 0; index < paginated.length; index++) {
        const item = paginated[index];
        const customerName = await getFullNameFromCode(item.customer); // Lấy tên KH từ mã

        let actionButtons = '';

        switch (item.status) {
            case 1:
                actionButtons = `
                    <div class="flex space-x-2">
                        <button onclick="handleReceived('${item.code}')" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Tiếp nhận</button>
                        <button onclick="handleRejected('${item.code}')" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Từ chối</button>
                    </div>
                `;
                break;
            case 2:
                actionButtons = `<button onclick="handleInProgress('${item.code}')" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Tiến hành sửa chữa</button>`;
                break;
            case 3:
                actionButtons = `<button onclick="handleComplete('${item.code}')" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Hoàn thành</button>`;
                break;
            case 4:
                actionButtons = `
            <button disabled class="bg-gray-400 text-white px-2 py-1 rounded cursor-not-allowed">Đợi trả hàng</button>
        `;
                break;
            case 5:
                actionButtons = `
            <button disabled class="bg-gray-400 text-white px-2 py-1 rounded cursor-not-allowed">Hoàn thành</button>
        `;
                break;
            case 6:
                actionButtons = `
            <button disabled class="bg-red-500 text-white px-2 py-1 rounded cursor-not-allowed">Từ chối</button>
        `;
                break;
            default:
                actionButtons = '';
                break;
        }

        const row = `
            <tr>
                <td class="px-4 py-2 border">${startIndex + index + 1}</td>
                <td class="px-4 py-2 border">${item.code}</td>
                <td class="px-4 py-2 border">${customerName || 'N/A'}</td>
                <td class="px-4 py-2 border">${item.employee || 'N/A'}</td>
                <td class="px-4 py-2 border">${item.order}</td>
                <td class="px-4 py-2 border">${item.product}</td>
                <td class="px-4 py-2 border">${item.productName}</td>
                <td class="px-4 py-2 border">${item.quantity}</td>
                <td class="px-4 py-2 border">${item.receive_date?.split('T')[0] || ''}</td>
                <td class="px-4 py-2 border">${item.complete_date?.split('T')[0] || ''}</td>
                <td class="px-4 py-2 border">${convertStatus(item.status)}</td>
                <td class="px-4 py-2 border">
                    ${actionButtons}
                </td>
            </tr>
        `;
        warrantyTable.innerHTML += row;
    }

    renderWarrantyPagination(warranties.length);
};

// Handle Tiếp nhận
const handleReceived = async (code) => {
    const confirm = await Swal.fire({
        title: "Xác nhận tiếp nhận sản phẩm?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Tiếp nhận",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
    });

    if (confirm.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:8080/DATN/warranty/received?code=${code}`, { method: 'POST' });
            const result = await res.json();

            if (res.ok && result.code === 200) {
                await Swal.fire("Thành công!", result.data, "success");
                fetchWarranties();
            } else {
                Swal.fire("Lỗi!", result.data || "Không thể tiếp nhận sản phẩm.", "error");
            }
        } catch {
            Swal.fire("Lỗi!", "Không thể tiếp nhận sản phẩm.", "error");
        }
    }
};

const handleRejected = async (code) => {
    const confirm = await Swal.fire({
        title: "Bạn có chắc muốn từ chối bảo hành?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Từ chối",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#aaa"
    });

    if (confirm.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:8080/DATN/warranty/rejected?code=${code}`, { method: 'POST' });
            const result = await res.json();

            if (res.ok && result.code === 200) {
                await Swal.fire("Thành công!", result.data, "success");
                fetchWarranties();
            } else {
                Swal.fire("Lỗi!", result.data || "Không thể từ chối sản phẩm.", "error");
            }
        } catch {
            Swal.fire("Lỗi!", "Không thể từ chối sản phẩm.", "error");
        }
    }
};

const handleInProgress = async (code) => {
    const confirm = await Swal.fire({
        title: "Xác nhận bắt đầu sửa chữa?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sửa chữa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#aaa"
    });

    if (confirm.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:8080/DATN/warranty/inProgress?code=${code}`, { method: 'POST' });
            const result = await res.json();

            if (res.ok && result.code === 200) {
                await Swal.fire("Thành công!", result.data, "success");
                fetchWarranties();
            } else {
                Swal.fire("Lỗi!", result.data || "Không thể tiến hành sửa chữa.", "error");
            }
        } catch {
            Swal.fire("Lỗi!", "Không thể tiến hành sửa chữa.", "error");
        }
    }
};

const handleComplete = async (code) => {
    const confirm = await Swal.fire({
        title: "Xác nhận hoàn thành bảo hành?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Hoàn thành",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#aaa"
    });

    if (confirm.isConfirmed) {
        try {
            const res = await fetch(`http://localhost:8080/DATN/warranty/complete?code=${code}`, { method: 'POST' });
            const result = await res.json();

            if (res.ok && result.code === 200) {
                await Swal.fire("Thành công!", result.data, "success");
                fetchWarranties();
            } else {
                Swal.fire("Lỗi!", result.data || "Không thể hoàn thành bảo hành.", "error");
            }
        } catch {
            Swal.fire("Lỗi!", "Không thể hoàn thành bảo hành.", "error");
        }
    }
};



const renderWarrantyPagination = (totalItems) => {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / pageSize);

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Trước";
    prevBtn.disabled = currentPage === 1;
    prevBtn.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    prevBtn.addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            await renderWarranties(filteredWarranties());
        }
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`;
        button.addEventListener("click", async () => {
            currentPage = i;
            await renderWarranties(filteredWarranties());
        });
        paginationContainer.appendChild(button);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Sau →";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    nextBtn.addEventListener("click", async () => {
        if (currentPage < totalPages) {
            currentPage++;
            await renderWarranties(filteredWarranties());
        }
    });
    paginationContainer.appendChild(nextBtn);
};

const filteredWarranties = () => {
    return allWarranties.filter(item =>
        (item.code || "").toLowerCase().includes(searchInput.value.toLowerCase())
    );
};

const fetchWarranties = async () => {
    try {
        const res = await fetch("http://localhost:8080/DATN/warranty/findAll");
        const result = await res.json();
        allWarranties = result.data || [];

        currentPage = 1;
        renderWarranties(filteredWarranties());

        searchInput.addEventListener("input", async () => {
            currentPage = 1;
            await renderWarranties(filteredWarranties()); // ✅ Đảm bảo dữ liệu sạch và không bị đè
        });

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu bảo hành:", error);
        warrantyTable.innerHTML = `<tr><td colspan="12" class="text-red-500 py-4">Không thể tải dữ liệu bảo hành</td></tr>`;
    }
};

window.addEventListener("DOMContentLoaded", fetchWarranties);

// Giả sử đây là hàm gọi API để lấy tên từ mã người dùng
async function getFullNameFromCode(code) {
    try {
        const res = await fetch(`http://localhost:8080/DATN/user/detail?code=${code}`);
        if (!res.ok) {
            return 'N/A';
        }
        const json = await res.json();
        return json.data?.fullName ?? 'N/A';
    } catch (err) {
        console.error("Lỗi khi gọi API người dùng:", err);
        return code + " (Lỗi)";
    }
}

