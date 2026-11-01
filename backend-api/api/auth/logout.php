<?php
require_once "../../config/Database.php";

try {
  if (isset($_COOKIE['refresh_token'])) {
    unset($_COOKIE['refresh_token']);
    setcookie('refresh_token', '', [
      'expires' => time() - 500000,
      'path' => '/',
      'httponly' => true
    ]);
  }

  echo json_encode([
    "success" => true,
    "message" => "Logged out successfully!"
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $th->getMessage()
  ]);
}
