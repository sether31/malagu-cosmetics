<?php

require_once "../../config/Database.php";
require_once "../../classes/OtpHandler.php";
require_once "../../classes/Mailer.php";

$data = json_decode(file_get_contents("php://input"));
$email = filter_var($data->email ?? "", FILTER_VALIDATE_EMAIL);
$password = trim($data->password ?? "");
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

  $check_user = $pdo->prepare("SELECT * FROM user_tb WHERE email = :email LIMIT 1");
  $check_user->execute([":email" => $email]);
  $user = $check_user->fetch();

  if (!$user) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email doesn't exist.", "errors" => ["email" => "Email doesn't exist."]]);
    exit;
  }

  $verify_password = password_verify($password, $user["password"]);

  if (!password_verify($password, $user["password"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incorrect password.", "errors" => ["password" => "Incorrect password.",]]);
    exit;
  }

  $otp_data = OtpHandler::generateOTP($email, "login", 6);

  if (!$otp_data) {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Failed to generate OTP. Please try again."
    ]);
    exit();
  }

  $sent = Mailer::sendOTP($otp_data["otp_code"], $email, "", "login", $otp_data["expires_at"]);

  if (!$sent) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server failed to dispatch email."]);
    exit;
  }

  echo json_encode([
    "success" => true,
    "message" => "OTP sent to your email."
  ]);
} catch (PDOException $e) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
  exit;
}
