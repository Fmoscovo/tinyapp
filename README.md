# TinyApp

### Objective
The objective of TinyApp is to create a web application that allows users to shorten URLs and manage them. Users can register, log in, create, edit, and delete their shortened URLs. The application uses cookies to maintain user sessions and bcrypt to hash user passwords.

### Inputs
- Express.js
- cookie-session
- bcryptjs
- EJS
- URL database
- User database

### Flow
- Set up middleware and functions
- Define routes for GET and POST requests
- Implement authentication and authorization for certain routes
- Render EJS templates for views
- Use bcrypt to hash and compare passwords
- Use cookies to maintain user sessions
- Generate random strings for short URLs
- Store URLs and user information in databases
- Redirect users to appropriate pages based on their actions

### Outputs
- Rendered HTML pages for views
- JSON representation of URL database
- Error messages for invalid user input or unauthorized access
- Redirects to appropriate pages based on user actions

### Additional Aspects
- The code uses helper functions to simplify certain tasks, such as getting a user by email
- The code uses middleware to check if a user is logged in before allowing access to certain routes
- The code uses bcrypt to hash and compare passwords for security purposes
- The code generates random strings for short URLs to avoid collisions and improve security
- The code was tested with different scenarios in Mocha and Chai (test folder).

  
## helpers.js
The objective of this code snippet is to define a function that takes an email and a database as inputs, and returns the user object associated with that email in the database.

## urls_show.ejs
The URL page displays the details of a TinyURL, including the original long URL and the short URL ID. It utilizes Bootstrap for styling and includes dependencies for Bootstrap CSS and JavaScript.

## urls_new.ejs
The New URL page displays a form for users to enter a URL and create a new TinyURL. It utilizes Bootstrap for styling and includes dependencies for Bootstrap CSS and JavaScript.

## urls_index.ejs
The My URLs page displays a table of URLs associated with the user's account. It utilizes Bootstrap for styling and includes dependencies for Bootstrap CSS and JavaScript.

## login.ejs
The Login page provides a form for users to enter their email and password to log in. It utilizes Bootstrap for styling and includes dependencies for Bootstrap CSS and JavaScript.

## register.ejs
The Registration page provides a form for users to create an account by entering their email and password. It utilizes Bootstrap for styling and includes dependencies for Bootstrap CSS and JavaScript.

## _header.ejs
All pages' header navigation is handled by the _header.ejs partial. It has a responsive navbar with links to various sections of the website and displays login/logout functionality based on the user variable's presence.
