# TinyApp Code Analysis for (W03D01)- Still in progress and will be updated as I go. 

### Objective
The objective of `express_server.js` is to create a web application using Express.js that allows users to shorten URLs and store them in a database. It handles HTTP requests and responses, renders HTML templates using EJS, and implements URL redirection.

### Inputs
- HTTP requests from clients
- URL database object
- User input from HTML forms

### Flow
1. Set up the Express.js application and middleware.
2. Define routes for handling HTTP requests:
   - GET request for the homepage ("/")
   - GET request to display the list of URLs ("/urls")
   - GET request to retrieve URL database in JSON format ("/urls.json")
   - GET request to display a simple "Hello World" page ("/hello")
   - GET request to render the URL submission form ("/urls/new")
   - GET request to display the details of a specific URL ("/urls/:id")
   - POST request to add a new URL to the database ("/urls")
   - GET request to handle URL redirection ("/u/:id")
3. Implement a function to generate a random string of 6 characters for short URLs.
4. Render HTML templates using EJS for displaying the list of URLs, details of a specific URL, URL submission form, and header navigation.
5. Start the server and listen for incoming requests.

### Outputs
- HTTP responses to clients
- Rendered HTML templates
- URL redirection

### Additional Aspects
- The application uses a URL database object to store short URLs and their corresponding long URLs.
- A random 6-character string is generated as the short URL for each new submission.
- The application handles errors when a short URL does not exist in the database.
- The application database is store in memory and once server is restarted it will lose any previously inputted URLs.

## urls_show.ejs

### Purpose
The `urls_show.ejs` template is used to display the details of a specific URL. It shows the long URL and the corresponding short URL ID.

## urls_new.ejs

### Purpose
The `urls_new.ejs` template is used to render the URL submission form. It allows users to enter a long URL and submit it to generate a short URL.

## urls_index.ejs

### Purpose
The `urls_index.ejs` template is used to display the list of URLs stored in the database. It shows the short URL IDs and their corresponding long URLs in a table format.

## _header.ejs

### Purpose
The `_header.ejs` partial is used as the header navigation component for all pages. It includes a navbar with links to the list of URLs and the URL submission form.
