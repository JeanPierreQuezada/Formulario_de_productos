<?php
require '../config.php';

$codigo = $_POST['codigo'];
$nombre = $_POST['nombre'];
$precio = $_POST['precio'];
$bodega = $_POST['bodega'];
$sucursal = $_POST['sucursal'];
$moneda = $_POST['moneda'];
$descripcion = $_POST['descripcion'];

$query = $pdo->prepare("INSERT INTO productos (codigo, nombre, precio, bodega, sucursal, moneda, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)");
if ($query->execute([$codigo, $nombre, $precio, $bodega, $sucursal, $moneda, $descripcion])) {
    echo json_encode(["message" => "Producto guardado con éxito."]);
} else {
    echo json_encode(["message" => "Error al guardar el producto."]);
}
?>