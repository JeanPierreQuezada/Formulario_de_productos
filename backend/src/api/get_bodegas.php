<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require '../config.php';

$conn = getDBConnection();

try {
    $stmt = $conn->prepare("SELECT id, nombre FROM bodegas ORDER BY nombre ASC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(["error" => "Error al obtener bodegas: " . $e->getMessage()]);
}
?>