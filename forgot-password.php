<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Send a password reset link (you can implement this logic)
        echo json_encode(['status' => 'success', 'message' => 'Password reset link sent to your email.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Email not found.']);
    }
}
?>