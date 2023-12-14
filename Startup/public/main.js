
const NewReviewEvent = 'newReview';

let courseData = {
    "The Ranches Golf Club": [1,1,1,1,1],
    "TalonsCove Golf Club": [1,1,1,1,1],
    "Hobble Creek Golf Course": [1,1,1,1,1],
    "Links at Sleepy Ridge": [1,1,1,1,1],
    "Fox Hollow Golf Club": [1,1,1,1,1],
}

let courseReviews = {
    "The Ranches Golf Club": [
        { scores: [5, 5, 1, 1] },
        { scores: [4, 4, 2, 2] },
        { scores: [1, 1, 4, 4] },
        
    ],
    "TalonsCove Golf Club": [
        { scores: [3, 4, 5, 2] },
        { scores: [1, 4, 1, 4] },
    ],
    "Hobble Creek Golf Course": [
        { scores: [3, 4, 5, 2] },
    ],
    "Links at Sleepy Ridge": [
        { scores: [3, 4, 5, 2] },
        { scores: [2, 2, 2, 2] },
    ],
    "Fox Hollow Golf Club": [
        { scores: [3, 3, 3, 3]},
    ],
    "Cedar Hills Golf Club": [
        { scores: [3, 3, 3, 3]},
    ],
    "The Oaks at Spanish Fork": [
        { scores: [3, 3, 3, 3]},
    ],
    "Thanksgiving Point Golf Club": [
        { scores: [3, 3, 3, 3]},
    ],
    "Gladstan Golf Course": [
        { scores: [3, 3, 3, 3]},
    ],
    "Timpanogos Golf Club": [
        { scores: [3, 3, 3, 3]},
    ],
    

}

class reviewMessages {
    constructor() {
        this.configureWebSocket();
    }


    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
            this.displayMsg('system', 'server', 'connected');
        };
        this.socket.onclose = (event) => {
            this.displayMsg('system', 'server', 'disconnected');
        };
        this.socket.onmessage = async (event) => {
            const msg = JSON.parse(await event.data.text());
            console.log(msg);
            console.log('onmessage');
            if (msg.type === NewReviewEvent) {
                populateTable();
                console.log("reached here");
                this.displayMsg('user', msg.from, `just submitted a review`);
            }
        };
    }
    
    displayMsg(cls, from, msg) {
        const chatText = document.querySelector('#review-messages');
        chatText.innerHTML = `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
    }
    
    broadcastEvent(from, type, value) {
        const event = {
            from: from,
            type: type,
            value: value,
        };
        this.socket.send(JSON.stringify(event)); 
    }
}


// get reviews from database
async function getStoredReviews() {
    let storedCourseReviews = [];
    try {
        // store most recent database reviews to localStorage
        const response = await fetch('/api/reviews');
        storedCourseReviews = await response.json();
        if (storedCourseReviews.msg == "Unauthorized") { 
            storedCourseReviews = localStorage.getItem('courseReviews');
        } else {
            localStorage.setItem('courseReviews', JSON.stringify(storedCourseReviews));
        }
        
    } catch {
        // if there was an error use example data above
        storedCourseReviews = localStorage.getItem('courseReviews');
    }

    updateCourseData(storedCourseReviews);

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

function populateTable() {
    const table = document.getElementById("rating-table");

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (let courseName in courseData) {
        appendCourseRow(courseName, courseData[courseName]);
    }
};

async function updateCourseData(courseReviews) {

    try {

        courseData = calculateAverageScores(courseReviews);

    
        localStorage.setItem('courseData', JSON.stringify(courseData));


    } catch {
        // if error happens just use example courseData above
        localStorage.setItem('courseData', JSON.stringify(courseData));
    }

    populateTable();
}
const instance = new reviewMessages();
// retrieve reviews
getStoredReviews();
// create review averages
updateCourseData();


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

async function loginUser() {
    loginOrCreate(`/api/auth/login`);
}

async function createUser() {
    loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
    const username = document.querySelector('#name')?.value;
    console.log(username);
    const password = document.querySelector('#password')?.value;
    console.log(password);
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });

    if (response.ok) {
        localStorage.setItem('username', username);
        window.location.href = 'index.html';
    } else {
        const body = await response.json();
        alert(`Error: ${body.msg}`);
    }
}


function logout() {
    localStorage.removeItem('username');
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
}

async function getUser(username) {
    const response = await fetch(`/api/user/${username}`);
    if (response.status === 200) {
        return response.json();
    }

    return null;
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

    const fakeUsernames = ['Jake', 'mrSquiggles', 'JonnyRotten', 'theBestGolferEver', 'TigerWoods', 'JackN', 'ArnoldPalmer'];
    let chosenName = 0;

    function getRandomFakeUser(fakeUsernames) {
        const randomIndex = Math.floor(Math.random() * fakeUsernames.length);
        chosenName = fakeUsernames[randomIndex];
        return chosenName;
    }

    getRandomFakeUser(fakeUsernames);
    const randomCourseName = getRandomCourse(courseReviews); 

    courseReviews[randomCourseName].push(getRandomReview());

    instance.broadcastEvent(chosenName, NewReviewEvent, 'Just submitted a new review');

    courseData = calculateAverageScores(courseReviews);
    localStorage.setItem('courseData', JSON.stringify(courseData));


    

    populateTable();
}





setInterval(function () {
    addRandomReview(courseReviews);
}, 10000);



