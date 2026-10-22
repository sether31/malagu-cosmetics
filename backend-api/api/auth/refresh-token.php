<?php
require_once "../../config/Database.php";
require_once "../../classes/JwtHandler.php";

if (!isset($_COOKIE['refresh_token'])) {
  http_response_code(401);
  echo json_encode(["success" => false, "message" => "No refresh token found."]);
  exit;
}

$refresh_token = $_COOKIE['refresh_token'];

try {
  $jwt = new JwtHandler($_ENV["JWT_SECRET_KEY"]);

  $new_access_token = $jwt->RefreshAccessToken($refresh_token);

  if ($new_access_token) {
    echo json_encode([
      "success" => true,
      "access_token" => $new_access_token
    ]);
  } else {
    http_response_code(401);
    echo json_encode([
      "success" => false,
      "message" => "Refresh Token Expired or Invalid."
    ]);
  }
} catch (\Throwable $th) {
  http_response_code(401);
  echo json_encode([
    'success' => false,
    'message' => 'Refresh Token Expired.'
  ]);
}
