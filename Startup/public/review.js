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

async function collectReviewData(event) {
    event.preventDefault();
    const name = document.getElementById("golf-course-names").value;
    const condition = parseInt(document.getElementById("course-condition").value, 10);
    const forgiveness = parseInt(document.getElementById("forgiveness").value, 10);
    const noise = parseInt(document.getElementById("noise").value, 10);
    const paceOfPlay = parseInt(document.getElementById("pace-of-play").value, 10);

    const reviewData = {
        courseName: name,
        courseCondition: condition,
        courseForgiveness: forgiveness,
        courseNoise: noise,
        coursePaceOfPlay: paceOfPlay
    };

    try {
        // add new review to db and return list of reviews
        fetch('/api/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
        // set reviews to localStorage
        const response = await response.json();
        localStorage.setItem('courseReviews', JSON.stringify(response));
        // return to main page
        window.location.href = "index.html";
    } catch {
        // if failure, store new review locally
        const courseReviews = localStorage.getItem('courseReviews');
        courseReviews[name].push[reviewData];
        localStorage.setItem('courseReviews', JSON.stringify(courseReviews));
    }
}



