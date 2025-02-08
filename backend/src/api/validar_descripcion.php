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

if (!isset($_GET["descripcion"])) {
    echo json_encode(["error" => "No se recibió el código"]);
    exit;
}

$descripcion = trim($_GET["descripcion"]);

// Validación de formato
if (!preg_match("/^.{10,1000}$/", $descripcion)) {
    echo json_encode(["error" => "Se permiten entre 10 a 1000 caracteres"]);
    exit;
}

echo json_encode(["estado" => true, "valor" => $descripcion]);
?>