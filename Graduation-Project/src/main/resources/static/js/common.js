document.addEventListener("DOMContentLoaded", function () {
    fetch("/includes/header.html")
        .then(res => res.text())
        .then(data => document.getElementById("header-placeholder").innerHTML = data);

    fetch("/includes/footer.html")
        .then(res => res.text())
        .then(data => document.getElementById("footer-placeholder").innerHTML = data);
});