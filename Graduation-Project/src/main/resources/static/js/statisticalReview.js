fetch("http://localhost:8080/DATN/order/statisticalReview")
    .then(response => response.json())
    .then(data => {
        // Extract the relevant data
        const totalReviews = data.data.totalReviews;
        const averageRating = data.data.averageRating;
        const star1 = data.data.star1;
        const star2 = data.data.star2;
        const star3 = data.data.star3;
        const star4 = data.data.star4;
        const star5 = data.data.star5;

        // Update the total reviews and average rating
        document.getElementById("totalReviews").textContent = totalReviews;
        document.getElementById("averageRating").textContent = averageRating;

        // Update each star row with the count and progress bar
        document.querySelector("#star1 .count").textContent = `${star1} lượt đánh giá`;
        document.querySelector("#star2 .count").textContent = `${star2} lượt đánh giá`;
        document.querySelector("#star3 .count").textContent = `${star3} lượt đánh giá`;
        document.querySelector("#star4 .count").textContent = `${star4} lượt đánh giá`;
        document.querySelector("#star5 .count").textContent = `${star5} lượt đánh giá`;

        // Calculate the width of the progress bar for each star
        document.querySelector("#star1 .progress-bar").style.width = (star1 / totalReviews) * 100 + "%";
        document.querySelector("#star2 .progress-bar").style.width = (star2 / totalReviews) * 100 + "%";
        document.querySelector("#star3 .progress-bar").style.width = (star3 / totalReviews) * 100 + "%";
        document.querySelector("#star4 .progress-bar").style.width = (star4 / totalReviews) * 100 + "%";
        document.querySelector("#star5 .progress-bar").style.width = (star5 / totalReviews) * 100 + "%";
    })
    .catch(error => console.error("Error fetching data:", error));