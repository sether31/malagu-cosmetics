<?php

require_once "../../config/Database.php";

$data = json_decode(file_get_contents("php://input"));
$email = filter_var($data->email, FILTER_VALIDATE_EMAIL) ?? "";
$password = $data->password ?? "";
$errors = [];

if (!$email || empty($password)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
  exit();
}
try {
  $pdo = (new Database())->pdo;

  $check_email = $pdo->prepare("SELECT * FROM user_tb WHERE email = :email limit 1");
  $check_email->execute([":email" => $email]);

  if ($check_email->rowCount() > 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email already exist"]);
    exit;
  }

  $hash_password = password_hash($password, PASSWORD_BCRYPT);


  $stmt = $pdo->prepare("INSERT INTO user_tb (email, password) VALUES (:email, :password)");
  $stmt->execute([
    ":email" => $email,
    ":password" => $hash_password
  ]);

  echo json_encode([
    "success" => true,
    "message" => "Registered user successfully!"
  ]);
} catch (\Throwable $e) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
}
