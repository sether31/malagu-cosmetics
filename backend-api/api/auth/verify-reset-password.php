<?php
require_once "../../config/Database.php";

$data = json_decode(file_get_contents("php://input"));
$email = filter_var($data->email ?? "", FILTER_VALIDATE_EMAIL);
$otp_code = trim($data->otp ?? "");
$new_password = trim($data->new_password ?? "");

if (!$email || empty($otp_code) || empty($new_password)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "All fields are required."]);
  exit();
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare(
    "SELECT * FROM otp_tb
    WHERE email = :email AND otp_code = :otp_code AND created_at >= NOW() - INTERVAL 5 MINUTE
    ORDER BY otp_id DESC LIMIT 1"
  );
  $stmt->execute([':email' => $email, ':otp_code' => $otp_code]);
  $otp_record = $stmt->fetch();

  if (!$otp_record) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid or expired OTP code."]);
    exit();
  }

  $stmtDelete = $pdo->prepare("DELETE FROM otp_tb WHERE email = :email");
  $stmtDelete->execute([':email' => $email]);

  $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
  $stmtUpdate = $pdo->prepare("UPDATE user_tb SET password = :password WHERE email = :email");
  $stmtUpdate->execute([':password' => $hashed_password, ':email' => $email]);

  echo json_encode([
    "success" => true,
    "message" => "Password has been reset successfully!"
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => $th->getMessage()]);
}
