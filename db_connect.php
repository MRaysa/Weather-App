<?php
$host = 'localhost'; // Database host
$dbname = 'weather_app'; // Database name
$username = 'root'; // Database username
$password = 'zara'; // Database password

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>