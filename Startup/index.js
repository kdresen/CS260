const express = require('express');
const app = express();
const DB = require('./database.js');

const request = require('request');

app.get('/dadJoke', (req, res) => {
    const apiKey = 'mrtaVqc6eMIqqVkXNRMDEw==yv4KjCdPrT9EOyB1';
    const limit = 1;

    request.get({
        url: 'https://api.api-ninjas.com/v1/dadjokes?limit=' + limit,
        headers: {
            'X-Api-Key': apiKey,
        },
    }, function (error, response, body) {
        if (error) {
            res.status(500).send('Error fetching joke');
            return console.error('Request failed:', error);
        } else if (response.statusCode !== 200) {
            res.status(response.statusCode).send(body.toString('utf8'));
            return console.error('Error:', response.statusCode, body.toString('utf8'));
        } else {
            const jokeData = JSON.parse(body);
            const joke = jokeData[0].joke;
            res.json({ joke });
        }
    })
})



let courseData = {
    "1. Course Name": [1,1,1,1,1],
    "2. Course Name": [1,1,1,1,1],
    "3. Course Name": [1,1,1,1,1],
    "4. Course Name": [1,1,1,1,1],
    "5. Course Name": [1,1,1,1,1],
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

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


// Get Reviews

apiRouter.get('/reviews', async (_req, res) => {
    const reviews = await DB.getAllCourseReviews();
    // data is currently stored in individual objects need to separated them into reviews
    console.log(reviews);
    for (let i = 0; i < reviews.length; i++) {
        const object = reviews[i];
        if (!courseReviews[object.courseName]) {
            courseReviews[object.courseName] = [];
        }

        const reviewData = {
            scores: [parseInt(object.courseCondition), parseInt(object.forgiveness), parseInt(object.noise), parseInt(object.paceOfPlay)],
        
        }

        courseReviews[object.courseName].push(reviewData);

    }

    console.log(courseReviews);

    res.send(courseReviews);
});

apiRouter.get('/data', async (_req, res) => {
    const courseData = await DB.getAllCourseReviews();
    res.send(courseData);
})

// make new review
apiRouter.post('/submit-review', async (req, res) => {
    const { courseName, courseCondition, forgiveness, noise, paceOfPlay } = req.body;

    // if the courseName isn't already in the list create it
    if (!courseReviews[courseName]) {
        courseReviews[courseName] = [];
    }

    // create a newReview object with info
    const newReview = {
        scores: [parseInt(courseCondition), parseInt(forgiveness), parseInt(noise), parseInt(paceOfPlay)],
    };
    // add newReview to db
    DB.addReview(newReview);

    // retrieve all reviews to update courseReviews list
    const allReviews = await DB.getAllCourseReviews();

    for (const review in allReviews) {
        const tempReview = {
            scores: [parseInt(review.courseCondition), parseInt(review.forgiveness), parseInt(review.noise), parseInt(review.paceOfPlay)],
        }
        courseReviews[review.courseName].push(tempReview);
    }    

    // send back new courseReviews list
    res.send(courseReviews);
});
