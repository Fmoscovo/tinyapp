const express = require("express");
const cookieParser = require("cookie-parser");
const { get } = require("request");
const e = require("express");
const app = express();
const PORT = 8080; // default port 8080

//   middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

const getUserByEmail = function (email) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

////////////routes////////////
const urlDatabase = {
  // database of URLs
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  id1: {
    id: "id1",
    email: "1@1.com",
    password: "test1",
  },
  id2: {
    id: "id2",
    email: "2@2.com",
    password: "test2",
  },
};

// GET request for the homepage
app.get("/", (req, res) => {
  res.send("Hello! Welcome to the TinyApp!Have Fun!");
});

// GET request to display the list of URLs
app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase,
  };
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
//GET request for the login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("login", templateVars);
});
// GET request to render the registration page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("register", templateVars);
});

// GET request to render the URL submission form
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render("urls_new", templateVars);
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
    user: users[req.cookies.user_id],
  };
  res.render("urls_show", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (user && user.password === password) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(403).send("Login failed. Please try again.");
  }
});

// app.post("/login", (req, res) => {
//   const { username } = req.body;
//   res.cookie("user_id", username);
//   res.redirect("/urls");
// });

// app.post("/logout", (req, res) => {
//   res.clearCookie("user_id");
//   res.redirect("/urls");
// });

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const id = generateRandomString();
  const newRegisterUser = { id, email, password };

  if (!email || !password) {
    res.status(400).send("Please enter a valid email and a valid password.");
    return;
  }

  const userInData = getUserByEmail(email);
  if (userInData) {
    res.status(400).send("Registration failed. Try another email.");
    return;
  }

  users[id] = newRegisterUser;
  res.cookie("user_id", id);
  res.redirect("/urls");
});

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
