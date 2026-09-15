<?php

require_once "../../config/Database.php";
require_once "../../classes/Otp-Handler.php";
require_once "../../classes/Mailer.php";

$data = json_decode(file_get_contents("php://input"));
$email = filter_var($data->email, FILTER_VALIDATE_EMAIL) ?? "";
$password = $data->password ?? "";
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

  $check_email = $pdo->prepare("SELECT * FROM user_tb WHERE email = :email limit 1");
  $check_email->execute([":email" => $email]);

  if ($check_email->rowCount() > 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email already exist", "errors" => ["email" => "Email already exist"]]);
    exit;
  }

  $otp_data = OtpHandler::generateOTP($email, "registration", 5);

  if (!$otp_data) {
    http_response_code(500);
    echo json_encode([
      "success" => false,
      "message" => "Failed to generate OTP. Please try again."
    ]);
    exit();
  }

  Mailer::sendOTP($otp_data['otp_code'], $email, "", "registration", $otp_data["expires_at"]);

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
