const express = require("express");
const session = require("cookie-session");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080;

const helpers = require("./helpers");

///////////////////////////MIDDLEWARE/////////////////////////////////////
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "session",
    keys: ["secret-key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

//////////////////////////////////FUNCTIONS///////////////////////////////
//-> check if a user is logged in by verifying the existence of a user_id.
const requiredLogin = function (req, res, next) {
  const userId = req.session.user_id;

  if (!userId || !users[userId]) {
    res.redirect("/login");
    return;
  }

  next();
};
//=>generate a random string of 6 alphanumeric characters.
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
//->return an object containing only the URLs where the userID is equal to the id of the currently logged-in user.
function urlsForUser(id) {
  const userUrls = {};

  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }

  return userUrls;
}

///////////////////////////////database//////////////////////////////
//->server-side implementation of a URL shortening service.
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
// -> server-side implementation of a user registration service.
const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "1@1.com",
    password: "test1",
  },
  bJ72kX: {
    id: "bJ72kX",
    email: "2@2.com",
    password: "test2",
  },
};

//////////////////////////// GET /////////////////////////////////////////////
//->redirect the user to either the "/urls" page if they are logged in or to the "/login" page if they are not logged in.
app.get("/", (req, res) => {
  const userId = req.session.user_id;

  if (userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
//->render the "urls_index" template with the URLs associated with the currently logged-in user.
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;

  if (!userId) {
    res.status(401).send("You must be logged in to view this page.");
    return;
  }

  const userUrls = urlsForUser(userId);

  const templateVars = {
    user: users[userId],
    urls: userUrls,
  };

  res.render("urls_index", templateVars);
});
//-> send a JSON response containing the entire urlDatabase object.
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//-> render the login page for the user to enter their credentials and log in to the application. If the user is already logged in, they will be redirected to the "/urls" page.
app.get("/login", (req, res) => {
  const user = users[req.session.user_id];

  if (user) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {
    user,
  };

  res.render("login", templateVars);
});
//->render the registration page for a new user and redirect them to the "/urls" page if they are already logged in.
app.get("/register", (req, res) => {
  const user = users[req.session.user_id];

  if (user) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {
    user,
  };

  res.render("register", templateVars);
});
//=>render the "urls_new" template and display it to the user
app.get("/urls/new", requiredLogin, (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };

  res.render("urls_new", templateVars);
});
//->handle GET requests to the "/u/:id" endpoint, where ":id" is a short URL code.
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (url) {
    res.redirect(url.longURL);
  } else {
    res.status(404).send("URL not found");
  }
});
//-> render a specific URL page with its corresponding short URL and long URL, only if the user is logged in and has permission to access the URL.
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (!userId) {
    res.status(401).send("You must be logged in to view this page.");
    return;
  }

  if (!url || url.userID !== userId) {
    res.status(403).send("You do not have permission to access this URL.");
    return;
  }

  const templateVars = {
    id: shortURL,
    longURL: url.longURL,
    user: users[userId],
  };

  res.render("urls_show", templateVars);
});

//////////////////////////POST ////////////////////////////////////////////////
//-> handle the login process by receiving the email and password from the request body, retrieving the user with the matching email from the users object, comparing the entered password with the hashed password stored in the user object, and setting the user_id in the session if the login is successful.
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = helpers.getUserByEmail(email, users);

  console.log("Entered password:", password);
  console.log("Stored hashed password:", user.hashedPassword);

  if (
    user &&
    user.hashedPassword &&
    bcrypt.compareSync(password, user.hashedPassword)
  ) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(403).send("Login failed. Please try again.");
  }
});
//->handle the registration of a new user by validating the input data, generating a unique user ID, hashing the password, and adding the new user to the users object. Finally, the function sets the user ID in the session and redirects the user to the /urls page.
app.post("/register", (req, res) => {
  const newUser = req.body;
  const newUserId = generateRandomString();

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  if (!newUser.password) {
    res.status(400).send("Password is required.");
    return;
  }
  if (!newUser.email) {
    res.status(400).send("Email is required.");
    return;
  }
  if (helpers.getUserByEmail(newUser.email, users)) {
    res.status(400).send("Email is already registered.");
    return;
  }
  users[newUserId] = {
    id: newUserId,
    email: newUser.email,
    hashedPassword: hashedPassword, // Use 'hashedPassword' instead of 'password'
  };
  req.session.user_id = newUserId;
  res.redirect("/urls");
});
//-> create a new short URL for a given long URL and associate it with the user who created it.
app.post("/urls", requiredLogin, (req, res) => {
  const userId = req.session.user_id;

  if (!userId || !users[userId]) {
    res.status(401).send("You must be logged in to create a short URL.");
    return;
  }

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: userId };
  res.redirect(`/urls/${shortURL}`);
});
//=> handle the POST request for logging out the user by destroying the session and redirecting them to the login page.
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
//-> update the long URL associated with a given short URL in the urlDatabase object. This function is triggered when a user submits a form to update a URL on the "/urls/:id/update" route.
app.post("/urls/:id/update", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;
  const url = urlDatabase[shortURL];

  if (!userId) {
    res.status(401).send("You must be logged in to perform this action.");
    return;
  }

  if (!url || url.userID !== userId) {
    res.status(403).send("You do not have permission to perform this action.");
    return;
  }

  url.longURL = updatedLongURL;
  res.redirect("/urls");
});
//->handle the deletion of a URL from the urlDatabase object, given a specific shortURL ID.
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (!userId) {
    res.status(401).send("You must be logged in to perform this action.");
    return;
  }

  if (!url || url.userID !== userId) {
    res.status(403).send("You do not have permission to perform this action.");
    return;
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

///////////////////////////////////////// LISTEN //////////////////////////////
app.listen(PORT, () => {
  console.log(`TinyApp is working on port ${PORT}!`);
});
