<?php
require_once "../../config/Database.php";
require_once "../../classes/JwtHandler.php";

$data = json_decode(file_get_contents("php://input"));
$email = filter_var($data->email ?? "", FILTER_VALIDATE_EMAIL);
$password = $data->password ?? "";
$otp_code = $data->otp ?? "";
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
    "SELECT * FROM otp_tb
    WHERE email = :email AND otp_code = :otp_code AND created_at >= NOW() - INTERVAL 5 MINUTE
    ORDER BY otp_id DESC LIMIT 1"
  );
  $stmt->execute([':email' => $email, ':otp_code' => $otp_code]);
  $otp_record = $stmt->fetch();

  if (!$otp_record) {
    http_response_code(400);
    echo json_encode([
      "success" => false,
      "message" => "Invalid or expired OTP code."
    ]);
    exit;
  }

  $stmt = $pdo->prepare("SELECT * FROM user_tb WHERE email = :email LIMIT 1");
  $stmt->execute([":email" => $email]);
  $user = $stmt->fetch();


  $jwt = new JwtHandler($_ENV["JWT_SECRET_KEY"]);
  $token = $jwt->generateToken($user["user_id"]);

  setcookie("refresh_token", $token["refresh_token"], time() + 604800, "/", "", false, true);

  echo json_encode([
    "success" => true,
    "message" => "Login Successfully!",
    "access_token" => $token["access_token"]
  ]);
} catch (PDOException $e) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => $e->getMessage()
  ]);
  exit;
}
