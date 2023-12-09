let storedCourseData = localStorage.getItem('courseData');
let storedCourseReviews = localStorage.getItem('courseReviews');

if (storedCourseData) {
    courseData = JSON.parse(storedCourseData);
}
if (storedCourseReviews) {
    courseReviews = JSON.parse(storedCourseReviews);
}

populateCourseNames(courseData);


function populateCourseNames(courseData) {
    const selectElement = document.getElementById("golf-course-names");

    Object.keys(courseData).forEach(courseName => {
        let option = document.createElement("option");
        option.value = courseName;
        option.textContent = courseName;
        selectElement.appendChild(option);
    })
}


function checkLogin() {
    const username = localStorage.getItem('username');

    if(!username) {
        alert("Please log in to write a review.");
        window.location.href = "index.html"; 

    } else {
        alert("Thank you for submitting a review");
    }
}

function collectReviewData(event) {
    event.preventDefault();

    const courseName = document.getElementById("golf-course-names").value;
    const courseCondition = parseInt(document.getElementById("course-condition").value, 10);
    const courseForgiveness = parseInt(document.getElementById("forgiveness").value, 10);
    const courseNoise = parseInt(document.getElementById("noise").value, 10);
    const coursePaceOfPlay = parseInt(document.getElementById("pace-of-play").value, 10);

    const reviewData = {
        courseName,
        courseCondition,
        courseForgiveness,
        courseNoise,
        coursePaceOfPlay,
    };

    fetch('/api/submit-review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })
    .then(response => response.json())
    .then(data => {
        alert("Thank you for submitting your review!");
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error("Error:", error);
    });

    localStorage.setItem('courseReviews', JSON.stringify(courseReviews));
}



