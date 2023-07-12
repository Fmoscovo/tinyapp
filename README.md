# TinyApp Code Analysis for (W03D02)- Still in progress and will be updated as I go. 

### Objective
The objective of TinyApp is to create a web application that allows users to shorten URLs and store them in a database. Users can also view, edit, and delete their URLs, as well as register and log in to the application.

### Inputs
- Express.js library
- cookie-parser 
- HTML, CSS, and JavaScript code for the front-end
- URL database object

### Flow
- Set up middleware and server
- Define routes for different pages and actions
- Render HTML templates with dynamic data
- Handle form submissions and update the URL database
- Use cookies to store user information

### Outputs
- Homepage with a welcome message
- List of URLs with options to edit and delete
- URL submission form
- URL details page with options to edit and delete
- Login and registration pages
- JSON representation of the URL database

### Additional Aspects
- The generateRandomString() function is used to generate unique IDs for each URL in the database
- The application uses the EJS templating engine to render dynamic HTML pages

## urls_show.ejs

### Purpose
The urls_show.ejs template is used to display the details of a specific URL. It shows the long URL and the corresponding short URL ID. It also provides an option to edit the URL by updating the long URL.

## urls_new.ejs

### Purpose
The urls_new.ejs template is used to render the URL submission form. It provides a form where users can enter a long URL and submit it to generate a short URL.

## urls_index.ejs

### Purpose
The urls_index.ejs template is used to display the list of URLs stored in the database. It renders a table that shows the short URL IDs and their corresponding long URLs. It also provides options to edit or delete each URL.

## _header.ejs

### Purpose
The _header.ejs partial is used as the header navigation component for all pages. It includes a navbar with links to the list of URLs and the URL submission form. Additionally, it displays a login/logout functionality based on the presence of the username variable. If the user is logged in, it shows a welcome message with the username and a "Log Out" button. If the user is not logged in, it displays a form to enter a username and a "Login" button.
