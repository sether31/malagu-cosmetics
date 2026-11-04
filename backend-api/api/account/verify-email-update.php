<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";
require_once "../../classes/OTpHandler.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"));
$new_email = filter_var($data->new_email ?? "", FILTER_VALIDATE_EMAIL);
$otp_code = trim($data->otp ?? "");

if (!$new_email || empty($otp_code)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Email and OTP code are required."]);
  exit();
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare(
    "SELECT * FROM otp_tb
    WHERE email = :email AND otp_code = :otp_code AND created_at >= NOW() - INTERVAL 5 MINUTE
    ORDER BY otp_id DESC LIMIT 1"
  );
  $stmt->execute([':email' => $new_email, ':otp_code' => $otp_code]);
  $otp_record = $stmt->fetch();

  if (!$otp_record) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid or expired OTP code."]);
    exit();
  }

  $stmtDelete = $pdo->prepare("DELETE FROM otp_tb WHERE email = :email");
  $stmtDelete->execute([':email' => $new_email]);

  $stmtUpdate = $pdo->prepare("UPDATE user_tb SET email = :email WHERE user_id = :user_id");
  $stmtUpdate->execute([':email' => $new_email, ':user_id' => $user_id]);

  $stmtGet = $pdo->prepare("SELECT user_id, profile_picture, full_name, email FROM user_tb WHERE user_id = :user_id LIMIT 1");
  $stmtGet->execute([":user_id" => $user_id]);
  $updatedUser = $stmtGet->fetch();

  echo json_encode([
    "success" => true,
    "message" => "Email updated successfully!",
    "user" => [
      "user_id" => $updatedUser["user_id"],
      "profile_picture" => $updatedUser["profile_picture"],
      "name" => $updatedUser["full_name"],
      "email" => $updatedUser["email"]
    ]
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => $th->getMessage()]);
}
