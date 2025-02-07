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

if (!isset($_GET["nombre"])) {
    echo json_encode(["error" => "No se recibio el codigo"]);
    exit;
}

$nombre = trim($_GET["nombre"]);

// Validación de formato
if (strlen($nombre) === 0) {
    echo json_encode(["error" => "Este campo no debe quedar en blanco"]);
    exit;
}

if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+$/", $nombre)) {
    echo json_encode(["error" => "Solo se permiten letras"]);
    exit;
}

if (strlen($nombre) < 2 || strlen($nombre) > 50) {
    echo json_encode(["error" => "Debe tener entre 2 y 50 caracteres"]);
    exit;
}
?>