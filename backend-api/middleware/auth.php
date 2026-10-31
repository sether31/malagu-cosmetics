<?php
require_once __DIR__ . "/../classes/JwtHandler.php";

function getAuthenticatedUserId()
{
  $headers = apache_request_headers();
  $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

  if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized: No token provided."]);
    exit;
  }

  $jwt_token = $matches[1];

  try {
    $jwt = new JwtHandler($_ENV["JWT_SECRET_KEY"]);
    $decoded = $jwt->decodeToken($jwt_token);

    if (!$decoded || !isset($decoded->user_id)) {
      http_response_code(401);
      echo json_encode(["success" => false, "message" => "Invalid access token."]);
      exit;
    }

    return $decoded->user_id;
  } catch (\Throwable $th) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Token verification failed."]);
    exit;
  }
}
