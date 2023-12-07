
let courseData = {};

let courseReviews = {};


let storedCourseData = localStorage.getItem('courseData');
let storedCourseReviews = localStorage.getItem('courseReviews');
console.log(storedCourseReviews);

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

    console.log(courseName);
    const reviewData = {
        scores: [courseCondition, courseForgiveness, courseNoise, coursePaceOfPlay],
    };

    if (courseReviews[courseName]) {
        courseReviews[courseName].push(reviewData);
    }
  

    localStorage.setItem('courseReviews', JSON.stringify(courseReviews));

    // Display a thank-you message
    alert("Thank you for submitting your review!");

    // Redirect back to index.html
    window.location.href = "index.html";
}



