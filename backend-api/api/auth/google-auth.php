<?php
require_once "../../config/Database.php";
require_once "../../classes/JwtHandler.php";

$data = json_decode(file_get_contents("php://input"));
$code = $data->code ?? "";

if (!$code) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'No authorization code provided']);
  exit;
}

$client = new Google\Client();
$client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
$client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET_ID']);
$client->setRedirectUri('postmessage');

try {
  $token = $client->fetchAccessTokenWithAuthCode($code);

  if (isset($token["error"])) {
    throw new Exception("Invalid code: " . $token['error']);
  }

  $client->setAccessToken($token["access_token"]);

  $google_client = new Google\Service\Oauth2($client);
  $user_info = $google_client->userinfo->get();
  $user_email = $user_info->email;

  $pdo = (new Database())->pdo;
  $check_email = $pdo->prepare("SELECT * FROM user_tb WHERE email = :email LIMIT 1");
  $check_email->execute([":email" => $user_email]);
  $user = $check_email->fetch();

  $user_id = null;
  $message = null;

  if ($user) {
    $user_id = $user["user_id"];
    $message = "Login Successfully!";
  } else {
    $stmt = $pdo->prepare("INSERT INTO user_tb (email) VALUES (:email)");
    $stmt->execute([":email" => $user_email]);
    $user_id = $pdo->lastInsertId();
    $message = "Register Successfully!";
  }

  $jwt = new JwtHandler($_ENV["JWT_SECRET_KEY"]);
  $token = $jwt->generateToken($user_id);

  setcookie("refresh_token", $token["refresh_token"], time() + 120, "/", "", false, true);

  echo json_encode([
    "success" => true,
    "message" => $message,
    "access_token" => $token["access_token"]
  ]);
} catch (Exception $e) {
  http_response_code(401);
  echo json_encode(['success' => false, 'message' => 'Google Auth Failed: ' . $e->getMessage()]);
}
