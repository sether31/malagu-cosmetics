<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare("SELECT user_id, profile_picture, full_name, email FROM user_tb WHERE user_id = :user_id LIMIT 1");
  $stmt->execute([":user_id" => $user_id]);
  $user = $stmt->fetch();

  echo json_encode([
    "success" => true,
    "message" => "Successfully fetched user data.",
    "user" => [
      "user_id" => $user["user_id"],
      "profile_picture" => $user["profile_picture"],
      "name" => $user["full_name"],
      "email" => $user["email"]
    ]
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => true,
    "message" => $th->getMessage()
  ]);
}
