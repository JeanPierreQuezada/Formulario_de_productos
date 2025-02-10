<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if ($input === null) {
    http_response_code(400);
    echo json_encode(["error" => "Formato JSON inválido"]);
    exit;
}

$required_fields = ["codigo", "nombre", "precio", "descripcion", "bodega", "sucursal", "moneda", "material"];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "El campo '$field' es obligatorio"]);
        exit;
    }
}

if (!is_array($input["material"]) || count($input["material"]) < 2) {
    http_response_code(400);
    echo json_encode(["error" => "Debe seleccionar al menos dos materiales"]);
    exit;
}

$codigo = trim($input["codigo"]);
$nombre = trim($input["nombre"]);
$descripcion = trim($input["descripcion"]);
$precio = floatval($input["precio"]);
$bodega = intval($input["bodega"]);
$sucursal = intval($input["sucursal"]);
$moneda = intval($input["moneda"]);
$material = implode(", ", array_map("trim", $input["material"]));

try {
    $conn = getDBConnection();
    if (!$conn) {
        throw new PDOException("Error de conexión a la base de datos");
    }

    $stmt = $conn->prepare("
        INSERT INTO productos (codigo, nombre, precio, bodega, sucursal, moneda, descripcion, material) 
        VALUES (:codigo, :nombre, :precio, :bodega, :sucursal, :moneda, :descripcion, :material)
    ");

    $stmt->bindParam(":codigo", $codigo);
    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":precio", $precio);
    $stmt->bindParam(":bodega", $bodega, PDO::PARAM_INT);
    $stmt->bindParam(":sucursal", $sucursal, PDO::PARAM_INT);
    $stmt->bindParam(":moneda", $moneda, PDO::PARAM_INT);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":material", $material);

    $stmt->execute();

    http_response_code(201);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al insertar el producto: " . $e->getMessage()]);
}
?>