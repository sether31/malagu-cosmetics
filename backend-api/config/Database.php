<?php
require_once __DIR__ . "/../vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();

$allowedOrigin = $_ENV['FRONTEND_URL'];

header("Access-Control-Allow-Origin: {$allowedOrigin}");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit(); 
}

date_default_timezone_set('Asia/Manila');

class Database {
  private $host;
  private $dbname;
  private $user;
  private $password;
  private $port;

  public $pdo;

  function __construct()
  {
    $this->host = $_ENV['DB_HOST'];
    $this->dbname = $_ENV['DB_NAME'];
    $this->user = $_ENV['DB_USER'];
    $this->password = $_ENV['DB_PASS'];
    $this->port = $_ENV['DB_PORT'];

    try {
      $dsn = "mysql:host={$this->host};dbname={$this->dbname};port={$this->port};charset=utf8mb4;";
      $this->pdo = new PDO($dsn, $this->user, $this->password);
      $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      die("Connection Failed: " . $e->getMessage());
    }
  }
}







?>