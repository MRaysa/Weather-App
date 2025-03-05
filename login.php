<?php
// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Check for admin login
if ($email === 'admin' && $password === 'admin') {
    echo json_encode(["status" => "success", "message" => "Admin login successful!", "redirect" => "admin.html"]);
    exit;
}

// Connect to the database (Modify this with your database credentials)
$servername = "your_server";
$username = "your_username";
$password_db = "your_password";
$dbname = "your_database";

$conn = new mysqli($servername, $username, $password_db, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}

// Verify user credentials
$sql = "SELECT * FROM users WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Login successful!", "redirect" => "dashboard.html"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
}

$stmt->close();
$conn->close();
?>
