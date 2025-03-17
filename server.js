const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5502;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// File path for storing user data
const usersFilePath = path.join(__dirname, "users.txt");

// Helper function to read users from the file
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, "[]"); // Create an empty file if it doesn't exist
  }
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

// Helper function to write users to the file
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Signup Endpoint
app.post("/signup", (req, res) => {
  const { fullName, email, password, defaultLocation } = req.body;

  // Read existing users
  const users = readUsers();

  // Check if the user already exists
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Add the new user
  users.push({ fullName, email, password, defaultLocation });
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Read existing users
  const users = readUsers();

  // Find the user
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login successful", user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
