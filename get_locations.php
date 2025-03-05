<?php
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'];

    $stmt = $conn->prepare("SELECT location FROM saved_locations WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($locations);
}
?>