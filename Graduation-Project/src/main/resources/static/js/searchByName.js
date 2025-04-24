window.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("keyword");
    if (keyword) {
        fetch(`http://localhost:8080/DATN/products/findByName?name=${encodeURIComponent(keyword)}`)
            .then(res => res.json())
            .then(data => renderProductList(data));
    }
});

function renderProductList(products) {
    const container = document.getElementById("findAll");
    container.innerHTML = "";
    products.forEach(p => {
        const item = document.createElement("div");
        item.className = "bg-white rounded-lg shadow-md p-4";
        item.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-cover mb-2">
            <h3 class="text-lg font-semibold">${p.name}</h3>
            <p class="text-red-500 font-bold">${p.realPrice.toLocaleString()}đ</p>
        `;
        container.appendChild(item);
    });
}