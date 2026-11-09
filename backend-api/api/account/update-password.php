<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"), true);
$current_password = $data["current_password"] ?? "";
$new_password = $data["new_password"] ?? "";

if (empty($new_password)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "New password is required."]);
  exit();
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare("SELECT password FROM user_tb WHERE user_id = :user_id LIMIT 1");
  $stmt->execute([":user_id" => $user_id]);
  $user = $stmt->fetch();

  if (!$user) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit();
  }

  if (!empty($user["password"])) {
    if (empty($current_password)) {
      http_response_code(400);
      echo json_encode(["success" => false, "message" => "Current password is required."]);
      exit();
    }

    if (!password_verify($current_password, $user["password"])) {
      http_response_code(400);
      echo json_encode(["success" => false, "message" => "Incorrect current password."]);
      exit();
    }
  }

  $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

  $stmtUpdate = $pdo->prepare("UPDATE user_tb SET password = :password WHERE user_id = :user_id");
  $stmtUpdate->execute([
    ":password" => $hashed_password,
    ":user_id" => $user_id
  ]);

  $message = empty($user["password"]) ? "Password set successfully!" : "Password updated successfully!";

  echo json_encode([
    "success" => true,
    "message" => $message
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => $th->getMessage()]);
}
