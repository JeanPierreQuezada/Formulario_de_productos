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

if (!isset($_GET["codigo"])) {
    echo json_encode(["error" => "No se recibió el código"]);
    exit;
}

$codigo = trim($_GET["codigo"]);

// Validación de formato
if (!preg_match("/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/", $codigo)) {
    echo json_encode(["error" => "Se permite letras y numeros, sin otros caracteres."]);
    exit;
}

if (strlen($codigo) < 5 || strlen($codigo) > 15) {
    echo json_encode(["error" => "Debe tener entre 5 y 15 caracteres."]);
    exit;
}

// Validación en la base de datos
try {
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM productos WHERE codigo = ?");
    $stmt->execute([$codigo]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row["count"] > 0) {
        echo json_encode(["unico" => false, "error" => "Este codigo ya está registrado."]);
    } else {
        echo json_encode(["unico" => true]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}
?>