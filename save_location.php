<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $location = $_POST['location'];

    $stmt = $conn->prepare("INSERT INTO saved_locations (user_id, location) VALUES (:user_id, :location)");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':location', $location);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Location saved!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save location.']);
    }
}
?>