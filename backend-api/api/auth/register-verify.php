<?php
require_once '../../config/Database.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';
$otp = trim($data['otp'] ?? '');
$errors = [];

if (!$email) {
  $errors["email"] = "A valid email is required.";
}
if (empty($password)) {
  $errors["password"] = "Password is required.";
}

if (!empty($errors)) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Please fill in all fields.",
    "errors" => $errors
  ]);
  exit();
}


try {
  $pdo = (new Database())->pdo;
  $stmt = $pdo->prepare(
    "SELECT otp_id FROM otp_tb 
    WHERE email = :email AND otp_code = :otp_code AND created_at >= NOW() - INTERVAL 5 MINUTE 
    ORDER BY otp_id DESC LIMIT 1"
  );
  $stmt->execute([':email' => $email, ':otp_code' => $otp]);
  $otp_record = $stmt->fetch();

  if (!$otp_record) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or expired OTP code."]);
    exit;
  }

  // check email
  $check_email = $pdo->prepare("SELECT user_id FROM user_tb WHERE email = :email");
  $check_email->execute(['email' => $email]);
  if ($check_email->fetch()) {
    http_response_code(400);
    echo json_encode(["message" => "This email is already registered."]);
    exit;
  }

  $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
  $insertStmt = $pdo->prepare("INSERT INTO user_tb (email, password) VALUES (:email, :password)");
  $insertStmt->execute([
    ':email' => $email,
    ':password' => $hashedPassword
  ]);

  $deleteStmt = $pdo->prepare("DELETE FROM otp_tb WHERE email = :email");
  $deleteStmt->execute(['email' => $email]);

  http_response_code(201);
  echo json_encode(["message" => "Registered Successfully!"]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
  exit;
}
