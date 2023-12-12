const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const request = require('request');

const authCookieName = 'token';

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

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determin IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Create Auth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.username)) {
        res.status(409).send({ msg: 'Existing user'});
    } else {
        const user = await DB.createUser(req.body.username, req.body.password);

        // Set the cookie
        setAuthCookie(res, user.token);

        res.send({
            id: user._id,
        });
    }
});

// Get Auth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// Delete Auth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// GetUser returns info about a user
apiRouter.get('/user/:username', async (req, res) => {
    const user = await DB.getUser(req.params.username);
    if (user) {
        const token = req?.cookies.token;
        res.send({username: user.username, authenticated: token === user.token});
        return;
    }
    res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
let secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


// Get Reviews

secureApiRouter.get('/reviews', async (_req, res) => {

    let tempReviewList = {};
    const reviews = await DB.getAllCourseReviews();
    // data is currently stored in individual objects need to separated them into reviews
    for (const object of reviews) {

        if (!tempReviewList[object.courseName]) {
            tempReviewList[object.courseName] = [];
        }

        const reviewData = {
            scores: [parseInt(object.courseCondition), parseInt(object.forgiveness), parseInt(object.noise), parseInt(object.paceOfPlay)],
        
        }

        tempReviewList[object.courseName].push(reviewData);

        courseReviews = tempReviewList;

    }

    res.send(courseReviews);
});

secureApiRouter.get('/data', async (_req, res) => {
    const courseData = await DB.getAllCourseReviews();
    res.send(courseData);
})

// make new review
secureApiRouter.post('/submit-review', async (req, res) => {
    const review = {...req.body, ip: req.ip};

    // if the courseName isn't already in the list create it
    if (!courseReviews[review.courseName]) {
        courseReviews[review.courseName] = [];
    }

    // add newReview to db
    await DB.addReview(review);

    // retrieve all reviews to update courseReviews list
    const allReviews = await DB.getAllCourseReviews();

    for (const currentReview of allReviews) {
        const tempReview = {
            scores: [parseInt(currentReview.courseCondition), parseInt(currentReview.forgiveness), parseInt(currentReview.noise), parseInt(currentReview.paceOfPlay)],
        }
        courseReviews[currentReview.courseName].push(tempReview);
    }    

    // send back new courseReviews list
    res.send(courseReviews);
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}




