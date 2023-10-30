let courseData = {
    "1. Course Name": [10, 5, 5, 5, 5],
    "2. Course Name": [8, 3, 4, 5, 2],
    "3. Course Name": [12, 4, 2, 3, 1],
    "4. Course Name": [2, 3, 1, 4, 5],
}

// Store courseData in localStorage
localStorage.setItem('courseData', JSON.stringify(courseData));



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

let storedCourseData = localStorage.getItem('courseData');

if (storedCourseData) {
    courseData = JSON.parse(storedCourseData);
}


function populateTable() {
    for (let courseName in courseData) {
        appendCourseRow(courseName, courseData[courseName]);
    }
};

window.onload = populateTable();
window.onload = displayUsername();

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