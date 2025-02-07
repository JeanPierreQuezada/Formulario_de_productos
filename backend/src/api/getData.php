<?php
require '../config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT name, email FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error al obtener datos: " . $e->getMessage()]);
}
?>