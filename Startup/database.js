const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');


// connect to the db cluster
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const reviewsCollection = db.collection('reviews');


// Test that you can connect to the database
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}


async function addReview(newReview) {
  const result = await reviewsCollection.insertOne(newReview);
  return result;
}


// get all reviews with specific course name
function getCourseReviews(name) {
  const query = { courseName: name };
  const cursor = reviewsCollection.find(query);
  return cursor.toArray();
}

// get all reviews for all courses to use in courseData
function getAllCourseReviews() {
  const cursor = reviewsCollection.find();
  return cursor.toArray();
}

module.exports = { getUser, getUserByToken, createUser, addReview, getCourseReviews, getAllCourseReviews };







