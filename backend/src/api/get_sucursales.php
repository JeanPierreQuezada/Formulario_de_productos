<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../config.php';

if (!isset($_GET['bodega_id']) || empty($_GET['bodega_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Debe proporcionar un ID de bodega"]);
    exit();
}

$bodegaId = intval($_GET['bodega_id']);

try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = :bodega_id ORDER BY nombre ASC");
    $stmt->bindParam(":bodega_id", $bodegaId, PDO::PARAM_INT);
    $stmt->execute();
    $sucursales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode(["sucursales" => $sucursales]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener sucursales: " . $e->getMessage()]);
}
?>