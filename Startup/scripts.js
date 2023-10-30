let courseData = {
    "1. Course Name": [1,1,1,1,1],
    "2. Course Name": [1,1,1,1,1],
    "3. Course Name": [1,1,1,1,1],
    "4. Course Name": [1,1,1,1,1],
    "5. Course Name": [1,1,1,1,1],
}

let courseReviews = {
    "The Ranches": [
        { scores: [5, 5, 1, 1] },
        { scores: [4, 4, 2, 2] },
        { scores: [1, 1, 4, 4] },
        
    ],
    "Talons Cove": [
        { scores: [3, 4, 5, 2] },
        { scores: [1, 4, 1, 4] },
    ],
    "Hobble Creek": [
        { scores: [3, 4, 5, 2] },
    ],
    "Sleepy Ridge": [
        { scores: [3, 4, 5, 2] },
        { scores: [2, 2, 2, 2] },
    ],
    

}

// Store courseData in localStorage
let storedCourseData = localStorage.getItem('courseData');
let storedCourseReviews = localStorage.getItem('courseReviews');

if (storedCourseData) {
    courseData = JSON.parse(storedCourseData);
} else {
    localStorage.setItem('courseData', JSON.stringify(courseData));
}
if (storedCourseReviews) {
    courseReviews = JSON.parse(storedCourseReviews);
} else {
    localStorage.setItem('courseReviews', JSON.stringify(courseReviews));
}

function redoCourseData(courseReviews) {

}


function calculateAverageScores(courseReviews) {
    const aggregatedData = {};

    for (let courseName in courseReviews) {
        const reviews = courseReviews[courseName];

        if (Array.isArray(reviews[0])) {
            // Case where scores are directly provided as an array
            const totalScores = new Array(reviews[0].length).fill(0);

            for (const scores of reviews) {
                for (let i = 0; i < scores.length; i++) {
                    totalScores[i] += scores[i];
                    
                }
            }

            const averageScores = totalScores.map(score => Math.round(score / reviews.length));

            averageScores.unshift(reviews.length);

            aggregatedData[courseName] = averageScores;
        } else if (reviews[0] && Array.isArray(reviews[0].scores)) {
            // Case where scores are within an array of review objects
            const totalScores = new Array(reviews[0].scores.length).fill(0);

            for (const review of reviews) {
                for (let i = 0; i < review.scores.length; i++) {
                    totalScores[i] += review.scores[i];
                }
            }

            const averageScores = totalScores.map(score => Math.round(score / reviews.length));

            averageScores.unshift(reviews.length);

            aggregatedData[courseName] = averageScores;
        }
    }

    return aggregatedData;
}
courseData = calculateAverageScores(courseReviews);
localStorage.setItem('courseData', JSON.stringify(courseData));
window.onload = populateTable();









function appendCourseRow(courseName, rowItems) {
    let table = document.getElementById("rating-table");
    let row = document.createElement("tr");



    // Add course name to the first cell
    let courseNameCell = document.createElement("td");
    courseNameCell.textContent = courseName;
    row.appendChild(courseNameCell);

    // create and append row item cells
    for (let i = 0; i < rowItems.length; i++) {
        let cell = document.createElement("td");
        if (i === 0) {
            cell.textContent = rowItems[i];
        } else {
            for (let j = 0; j < rowItems[i]; j++) {
                let star = document.createElement("span");
                star.className = "fa fa-star checked";
                cell.appendChild(star);
            }
        }
        row.appendChild(cell);
    }

    // append the row to the table
    table.appendChild(row);
    
}




function populateTable() {
    const table = document.getElementById("rating-table");

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    for (let courseName in courseData) {
        appendCourseRow(courseName, courseData[courseName]);
    }
};


window.onload = displayUsername();
window.onload = function () {
    const isLoggedIn = !!localStorage.getItem('username');
    const loginPromptDiv = document.querySelector('.login-prompt');

    if (isLoggedIn) {
        loginPromptDiv.style.display = 'none';
    }
}

function displayUsername() {
    //
    const isLoggedIn = !!localStorage.getItem('username');
    // get username from local storage
    const username = localStorage.getItem('username');

    // Find username element
    const usernameElement = document.getElementById('username');

    if (isLoggedIn && usernameElement) {
        let span = document.createElement("span");
        span.textContent = ' ' + username;
        usernameElement.appendChild(span);
    } else {
        usernameElement.style.display = 'none';
    }
}

function handleLogin() {
    // get username and password
    const username = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // check if both fields are filled
    if (username.trim() === "" || password.trim() === "") {
        alert("Please fill in both fields");
        return;
    }
    
    // Store username in local storage
    localStorage.setItem('username', username);

    document.querySelector('.login-prompt').style.display = 'none';
    
    window.location.href= "review.html";

    alert("Login successful. You can now submit reviews.")
}




function checkLogin() {
    const username = localStorage.getItem('username');

    if(!username) {
        alert("Please log in to write a review.");

    } else {
        window.location.href = "review.html";
    }
}


function getRandomReviewInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomReview() {
    const scores = [];
    for (let i = 0; i < 4; i++) {
        scores.push(getRandomReviewInt(1, 5));
    }

    return { scores };
}

function getRandomCourse(courseReviews) {

    const courseNames = Object.keys(courseReviews);



    const randomIndex = Math.floor(Math.random() * courseNames.length);
    return courseNames[randomIndex];
}


function addRandomReview(courseReviews) {

    const randomCourseName = getRandomCourse(courseReviews);

    courseReviews[randomCourseName].push(getRandomReview());

    courseData = calculateAverageScores(courseReviews);
    localStorage.setItem('courseData', JSON.stringify(courseData));

    populateTable();
}


setInterval(function () {
    addRandomReview(courseReviews);
}, 10000);




