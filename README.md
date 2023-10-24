# Golfer's buddy

## Description deliverable

### Elevator pitch

If you are like me, you love golf. But with so many golf courses around, it can be expensive trying each one out to find one that you like. Sure you can look up course handicaps, consumer reviews, and comments from other golfers. But reviews can be very vague and unhelpful. That is why the Golfer's buddy application helps review golf courses on specific categories that anyone can understand. With Golfer's buddy, you can lookup a nearby course and see general information about the course from other golfers. With rating categories like: overall course condition, slice friendliness, picturesque value, pace of play, and others you can quickly see if the golf course is worth the money. New reviews and ratings are automatically updated to give you the most recent information and reviews. Be confident that even when you can't hit your driver, you can still enjoy your golf round.

### Design

![Main Page](https://github.com/kdresen/CS260/blob/ac37c7ed39a22b0b6434847029346fb84bf3946a/Screenshot%202023-09-27%20151228.png)
![Submit Review](https://github.com/kdresen/CS260/blob/94d10befe09a292ca5667548969ec3df353b751b/Screenshot%202023-09-27%20151246.png)

### Key Features

- Secure login over HTTPS
- Search golf courses reviewed
- Display of rating categories
- Show recent reviews
- Show course rating averages in realtime
- Rating averages are stored
- Ability to create reviews for a specific course
- Allow admin to remove reviews from database to prevent abuse
- Allow admin to add new local courses

### Technologies

The required technologies will be used in hte following ways

- DONE **HTML** - **Should be finished, may make some small changes in the future** HTML for page structure, will have two pages: login and viewing reviewed courses, submitting a review
- **CSS** - Design and styling of website to account for different screens, and create an asthetically pleasing layout
- **JavaScript** - Login, Reviewed courses, and submission of reviews
- **Service** - Backend service with endpoints for:
    - login
    - retrieving courses
    - submitting reviews
    - retrieving course ratings
- **DB** - Store users, courses, and reviews
- **Login** - Register and login users. Passwords and usernames stored securely in database. Can't submit reviews without authentication
- **WebSocket** - updates the overall course rating of each course with each review submitted. New reviews are displayed on Main page
- **React** - port application to use the React web framework
       
