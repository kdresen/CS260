const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');


// connect to the db cluster
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const collection = db.collection('reviews');


// Test that you can connect to the database
(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
})().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
});


async function addReview(newReview) {
  const result = await collection.insertOne(newReview);
  return result;
}


// get all reviews with specific course name
function getCourseReviews(name) {
  const query = { courseName: name };
  const cursor = collection.find(query);
  return cursor.toArray();
}

// get all reviews for all courses to use in courseData
function getAllCourseReviews() {
  const cursor = collection.find();
  return cursor.toArray();
}

module.exports = { addReview, getCourseReviews, getAllCourseReviews };







