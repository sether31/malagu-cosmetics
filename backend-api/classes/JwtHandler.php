<?php

require_once __DIR__ . "/../vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler
{
  public $secret_key;
  public $issuer;

  function __construct($secret_key, $issuer = "localhost")
  {
    $this->secret_key = $secret_key;
    $this->issuer = $issuer;
  }

  function generateToken($user_id)
  {
    $time = time();
    $access_payload = [
      "iss" => $this->issuer,
      "user_id" => $user_id,
      "exp" => $time + 300
    ];

    $refresh_payload = [
      "iss" => $this->issuer,
      "user_id" => $user_id,
      "exp" => $time + 604800
    ];

    return [
      "access_token" => JWT::encode($access_payload, $this->secret_key, "HS256"),
      "refresh_token" => JWT::encode($refresh_payload, $this->secret_key, "HS256"),
    ];
  }

  function decodeToken($token)
  {
    try {
      return JWT::decode($token, new Key($this->secret_key, "HS256"));
    } catch (\Throwable $th) {
      return false;
    }
  }

  function RefreshAccessToken($refresh_token)
  {
    $decoded = $this->decodeToken($refresh_token);

    if ($decoded && $decoded->user_id) {
      $time = time();
      $access_payload = [
        "iss" => $this->issuer,
        "user_id" => $decoded->user_id,
        "exp" => $time + 300
      ];

      return JWT::encode($access_payload, $this->secret_key, "HS256");
    }

    return false;
  }
}
