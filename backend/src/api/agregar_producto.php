<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["codigo"], $input["nombre"], $input["precio"], $input["descripcion"], $input["bodega"], $input["sucursal"], $input["moneda"])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos obligatorios"]);
    exit;
}

try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("INSERT INTO productos (codigo, nombre, precio, bodega, sucursal, moneda, descripcion) 
                            VALUES (:codigo, :nombre, :precio, :bodega, :sucursal, :moneda, :descripcion)");

    $stmt->bindParam(":codigo", $input["codigo"]);
    $stmt->bindParam(":nombre", $input["nombre"]);
    $stmt->bindParam(":precio", $input["precio"]);
    $stmt->bindParam(":bodega", $input["bodega"], PDO::PARAM_INT);
    $stmt->bindParam(":sucursal", $input["sucursal"], PDO::PARAM_INT);
    $stmt->bindParam(":moneda", $input["moneda"], PDO::PARAM_INT);
    $stmt->bindParam(":descripcion", $input["descripcion"]);

    $stmt->execute();

    http_response_code(201);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al insertar el producto: " . $e->getMessage()]);
}
?>