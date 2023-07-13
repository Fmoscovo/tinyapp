const express = require("express");
const cookieParser = require("cookie-parser");
const { get } = require("request");
const e = require("express");
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

app.get("/", (req, res) => {
  res.send("Hello! Welcome to the TinyApp!Have Fun!");
});

app.get("/urls", requiredLogin, (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase,
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
  const longURL = urlDatabase[shortURL];

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("URL not found");
  }
});

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

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

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
  const user = users[req.cookies.user_id];

  if (!user) {
    res.status(401).send("You must be logged in to create a short URL.");
    return;
  }

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
  const id = req.params.id;
  const updatedLongURL = req.body.updatedLongURL;
  urlDatabase[id] = updatedLongURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`TinyApp is working on port ${PORT}!`);
});
