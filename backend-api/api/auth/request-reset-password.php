<?php
require_once "../../config/Database.php";
require_once "../../classes/OtpHandler.php";
require_once "../../classes/Mailer.php";

$data = json_decode(file_get_contents("php://input"));
$email = filter_var($data->email ?? "", FILTER_VALIDATE_EMAIL);

if (!$email) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "A valid email is required.",
    "errors" => ["email" => "A valid email is required."]
  ]);
  exit();
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare("SELECT user_id FROM user_tb WHERE email = :email LIMIT 1");
  $stmt->execute([":email" => $email]);
  $user = $stmt->fetch();

  if (!$user) {
    http_response_code(400);
    echo json_encode([
      "success" => false,
      "message" => "Email doesn't exist.",
      "errors" => ["email" => "Email doesn't exist."]
    ]);
    exit();
  }

  $otp_data = OtpHandler::generateOTP($email, "reset_password", 6);

  if (!$otp_data) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to generate OTP code."]);
    exit();
  }

  $sent = Mailer::sendOTP($otp_data["otp_code"], $email, "", "reset_password", $otp_data["expires_at"]);

  if (!$sent) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server failed to send email."]);
    exit();
  }

  echo json_encode(["success" => true, "message" => "OTP sent to your email."]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => $th->getMessage()]);
}
