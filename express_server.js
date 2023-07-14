const express = require("express");
const session = require("cookie-session");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080;

///////////////////////////middleware/////////////////////////////////////
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "session",
    keys: ["secret-key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false, // Set to true for HTTPS only
    httpOnly: true,
  })
);

//////////////////////////////////////functions/////////////////////
const requiredLogin = function (req, res, next) {
  const userId = req.session.user_id;

  if (!userId || !users[userId]) {
    res.redirect("/login");
    return;
  }

  next();
};

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

function getUserByEmail(email, database) {
  for (const userId in database) {
    const user = database[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

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
app.get("/", (req, res) => {
  res.send("Hello! Welcome to the TinyApp! Have Fun!");
});

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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

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

app.get("/urls/new", requiredLogin, (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };

  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (url) {
    res.redirect(url.longURL);
  } else {
    res.status(404).send("URL not found");
  }
});

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
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);

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
  if (getUserByEmail(newUser.email, users)) {
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

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

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
