<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host ='db';
$db   = $_ENV['POSTGRES_DB'];
$user = $_ENV['POSTGRES_USER'];
$pass = $_ENV['POSTGRES_PASSWORD'];

function getDBConnection() {
    global $host, $db, $user, $pass;
    
    try {
        $dsn = "pgsql:host=$host;dbname=$db";
        $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        return $pdo;
    } catch (PDOException $e) {
        die(json_encode(["error" => "❌ Error en la conexión: " . $e->getMessage()]));
    }
}

?>