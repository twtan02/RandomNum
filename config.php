<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "randomnum";

$conn = new mysqli($servername, $username, $password, $dbname, 3306);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $collectedDigits = implode('', $data['digits']);

    $stmt = $conn->prepare("INSERT INTO transactions (collected_digits) VALUES (?)");
    $stmt->bind_param("s", $collectedDigits);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}