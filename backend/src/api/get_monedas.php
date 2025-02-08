<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../config.php';

try {
    $conn = getDBConnection();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a la base de datos"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT id, nombre FROM monedas ORDER BY nombre ASC");
    $stmt->execute();
    $monedas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(["monedas" => $monedas]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener monedas: " . $e->getMessage()]);
}
?>