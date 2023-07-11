const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
//   middleware
app.use(express.urlencoded({ extended: true }));

// function to generate a random string of 6 characters
function generateRandomString() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

////////////routes////////////
const urlDatabase = {
  // database of URLs
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// GET request for the homepage
app.get("/", (req, res) => {
  res.send("Hello! Welcome to the TinyApp!");
});

// GET request to display the list of URLs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET request to retrieve URL database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET request to display a simple "Hello World" page in HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// GET request to render the URL submission form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id; // Get the short URL ID from the request parameters
  const longURL = urlDatabase[shortURL]; // Retrieve the corresponding longURL from the database

  if (longURL) {
    res.redirect(longURL); // Redirect to the longURL
  } else {
    res.status(404).send("URL not found"); // Handle the case when the shortURL does not exist
  }
});
// GET request to display the details of a specific URL
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

// POST request adding a new URL to the database
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;
  urlDatabase[id] = updatedLongURL;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id; // Get the URL resource ID from the request parameters
  const updatedLongURL = req.body.updatedLongURL; // Get the updated long URL from the request body
  urlDatabase[id] = updatedLongURL; // Update the URL in the database
  res.redirect("/urls"); // Redirect the client back to the urls_index page
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id; // Remove the URL resource with the specified ID
  delete urlDatabase[id]; // Redirect the client back to the urls_index page
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp is working on port ${PORT}!`);
});
