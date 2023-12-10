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

The required technologies will be used in the following ways

- **HTML** - HTML for page structure, will have two pages: login and viewing reviewed courses, submitting a review
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


### HTML Deliverable
For this deliverable, I set up the structure of both pages of the application using HTML
- **HTML pages** - Completed Two pages that show the login and list of Golf courses with review and the page for writing a review
- **Links** - Completed Logging in redirects to the review page, added navigation links at top of page to write a review and to return to the course list page
- **Text** - Completed Each review rating is represented by a category title and a rating from 1 to 5 stars.
- **Selection** - Completed the review page uses dropdown boxes to choose from ratings and course names
- **Images** - Compeleted used an external library for icons to use a star icon for ratings, added header images to both pages
- **Login** - Completed created forms with input boxes and a submit button to login
- **Database** - Completed Dropdown boxes and course list will pull from the database for real time information of courses and average ratings for each category, still not done, I will need to set up the database first before the rest can get the values from it
- **Websocket** - Completed Course list ratings will pull real time to show an average rating for each category

### CSS Deliverable
For this deliverable I created the final appearance I want the website to have when completed.
- Header, footer, and main content body: Completed
- Navigation: Completed, styled nav bar with hover change with font and color changes for style, bar is fixed to left with a username display that will appear after login on the right side
- Responsive to window resizing: completed, all forms and contents adjust accordingly to match window size and reorders items to compensate for smaller screen
- Application elements: completed, items are spaced well and allow breathing room. color palette is simple and aestetically pleasing.
- Application text content: completed, text font and color is consitent throughout, changes color to match hover color change of buttons and nav bar
- application images: completed, added pngs to add more color and liven the page.d

 ### JavaScript Devliverable
 For this deliverable, I added the functionality of submitting reviews, and dynamically generating the table of average review scores for each Golf Course
 - login - logging in hides the login prompt and displays the username in the top right, it also redirects to the review writing page
 - database - displayed the average scores for each of the categories in the table on the main page. Currently stored and retrieved from local storage, but will be changed for the database
 - Websocket - a new random review is added every couple of seconds, this is then updated to show the increased review count and updated averages on the main page table. Will be replaced with websocket messages
 - application logic - user chooses scores from a dropdown on the review page and the scores are added into the table

### Service Deliverable
For this deliverable I added backend endpoints and thirdparty endpoints to interact with the server created in Node.js. These retrieve and add reviews to submit as well as populating the table of reviews
- Node.js/Express HTTP service - completed in index.js file
- Static middleware for frontend - completed in index.js file
- Calls to third party endpoints - added a Dad joke api on the home page
- Backend service endpoints - Placeholder for login that stores the user on the server. Endpoints for populating the table of reviews and adding new reviews to the table
- Frontend calls service endpoints - using fetch function to retrieve the response of each get api path

### DB Deliverable
For this deliverable I altered the code to retrieve and store reviews in a mongodb database
- MongoDB Atlas database created - Completed
- Endpoints for data - backend endpoints using MongoDB in database.js created and index.js files now use them for get and post actions
- Stores data in MongoDB - Completed, data persistent even after clearing local storage


