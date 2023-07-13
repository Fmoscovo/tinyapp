const express = require("express");
const cookieParser = require("cookie-parser");
const { get } = require("request");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const requiredLogin = function (req, res, next) {
  const userId = req.cookies.user_id;

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
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "id1",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "id2",
  },
  aAaBbC: {
    longURL: "http://www.example.com",
    userID: "id1",
  },
  xYz123: {
    longURL: "http://www.github.com",
    userID: "id2",
  },
  qweRty: {
    longURL: "http://www.twitter.com",
    userID: "id1",
  },
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

app.get("/", (req, res) => {
  res.send("Hello! Welcome to the TinyApp!Have Fun!");
});

app.get("/urls", requiredLogin, (req, res) => {
  const userId = req.cookies.user_id;
  const userUrls = {};

  for (const shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (url.userID === userId) {
      userUrls[shortURL] = url;
    }
  }

  const templateVars = {
    user: users[userId],
    urls: userUrls,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  const user = users[req.cookies.user_id];
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
  const user = users[req.cookies.user_id];
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
    user: users[req.cookies.user_id],
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
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (url && url.longURL) {
    const templateVars = {
      id: shortURL,
      longURL: url.longURL,
      user: users[req.cookies.user_id],
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("URL not found");
  }
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

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required.");
    return;
  }
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    res.status(400).send("Email is already registered.");
    return;
  }
  const id = generateRandomString();
  const newUser = { id, email, password };
  users[id] = newUser;
  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.post("/urls", requiredLogin, (req, res) => {
  const userId = req.cookies.user_id;

  if (!userId || !users[userId]) {
    res.status(401).send("You must be logged in to create a short URL.");
    return;
  }

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: userId };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/update", (req, res) => {
  const userId = req.cookies.user_id;
  const shortURL = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;

  if (urlDatabase[shortURL] && urlDatabase[shortURL].userID === userId) {
    urlDatabase[shortURL].longURL = updatedLongURL;
    res.redirect("/urls");
  } else {
    res.status(403).send("Unauthorized access or URL not found.");
  }
});

app.post("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const shortURL = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;

  if (urlDatabase[shortURL].userID === userId) {
    urlDatabase[shortURL].longURL = updatedLongURL;
  }

  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies.user_id;
  const shortURL = req.params.id;

  if (urlDatabase[shortURL].userID === userId) {
    delete urlDatabase[shortURL];
  }

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp is working on port ${PORT}!`);
});
