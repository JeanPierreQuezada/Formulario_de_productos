<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = getDBConnection();

// Validar si los parámetros fueron enviados
if (!isset($_GET["materiales"])) {
    echo json_encode(["error" => "No se recibio el codigo"]);
    exit;
}

$materiales = explode(',', $_GET["materiales"]); // Convertir la cadena en un array

// Validación de Materiales
if (count($materiales) < 2) {
    echo json_encode(["error" => "Debes seleccionar al menos dos materiales."]);
    exit;
}

echo json_encode(["estado" => true, "valor" => $materiales]);
?>