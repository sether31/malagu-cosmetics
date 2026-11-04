<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";
require_once "../../classes/Mailer.php";
require_once "../../classes/OTpHandler.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"));
$new_email = filter_var($data->new_email ?? "", FILTER_VALIDATE_EMAIL);

if (!$new_email) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "A valid email is required."]);
  exit();
}

try {
  $pdo = (new Database())->pdo;
  $stmtCheck = $pdo->prepare("SELECT * FROM user_tb WHERE email = :email LIMIT 1");
  $stmtCheck->execute([":email" => $new_email]);
  $user = $stmtCheck->fetch();
  if ($user) {
    echo json_encode([
      "success" => false,
      "message" => "Email already exist."
    ]);
    exit;
  }

  $otp_data = OtpHandler::generateOTP($new_email, "update email");

  if (!$otp_data) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to generate OTP."]);
    exit();
  }

  $sent = Mailer::sendOTP($otp_data["otp_code"], $new_email, $user["name"], "update email", $otp_data["expires_at"]);

  if (!$sent) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to dispatch verification email."]);
    exit();
  }

  echo json_encode([
    "success" => true,
    "message" => "Verification code sent to your new email."
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $th->getMessage()
  ]);
}
