<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require '../config.php';

$conn = getDBConnection();

if (!isset($_GET["bodega_id"])) {
    echo json_encode(["error" => "No se recibió el ID de la bodega"]);
    exit;
}

$bodega_id = intval($_GET["bodega_id"]);

try {
    $stmt = $conn->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = :bodega_id ORDER BY nombre ASC");
    $stmt->bindParam(':bodega_id', $bodega_id, PDO::PARAM_INT);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(["error" => "Error al obtener sucursales: " . $e->getMessage()]);
}
?>