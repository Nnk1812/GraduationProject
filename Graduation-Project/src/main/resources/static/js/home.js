const swiper = new Swiper('.swiper-container', {
    loop: true, // Cho phép quay vòng
    slidesPerView: 1, // Hiển thị 1 slide tại một thời điểm
    spaceBetween: 0, // Khoảng cách giữa các slide
    navigation: {
        nextEl: '.swiper-button-next', // Nút tiếp theo
        prevEl: '.swiper-button-prev', // Nút trước đó
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true, // Cho phép nhấn vào các chấm phân trang
    },
    autoplay: {
        delay: 5000, // Thời gian tự động chuyển slide (5 giây)
    },
});