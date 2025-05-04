const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5502;

app.use(bodyParser.json());
app.use(cors());

const usersFilePath = path.join(__dirname, "users.txt");

app.get("/users", (req, res) => {
  if (!fs.existsSync(usersFilePath)) {
    return res.status(404).json({ message: "User data not found" });
  }

  const data = fs.readFileSync(usersFilePath, "utf8");
  const users = JSON.parse(data);
  res.status(200).json(users);
});

const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, "[]"); 
  }
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.post("/signup", (req, res) => {
  const { fullName, email, password, defaultLocation } = req.body;

  const users = readUsers();

  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ fullName, email, password, defaultLocation });
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();

  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login successful", user });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
