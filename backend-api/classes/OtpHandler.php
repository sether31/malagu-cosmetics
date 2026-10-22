<?php

require_once __DIR__ . "/../config/Database.php";

date_default_timezone_set('Asia/Manila');

class OtpHandler
{
  public static function generateOTP($user_email, $purpose, $expiry_min = 5)
  {
    $otp_code = random_int(111111, 999999);
    $expires_at = date("Y:m:d H:i:s", strtotime("+$expiry_min minutes"));

    try {
      $pdo = (new Database())->pdo;
      $stmt = $pdo->prepare("INSERT INTO otp_tb (email, otp_code, purpose, expires_at) VALUES (:email, :otp_code, :purpose, :expires_at)");
      $stmt->execute([
        ":email" => $user_email,
        ":otp_code" => $otp_code,
        ":purpose" => $purpose,
        ":expires_at" => $expires_at
      ]);

      return ["otp_code" => $otp_code, "expires_at" => $expires_at];
    } catch (PDOException $e) {
      error_log("OTP Generation Error: " . $e->getMessage());
      return false;
    }
  }

  public static function verifyOTP($user_email, $otp_code, $purpose)
  {
    try {
      $pdo = (new Database())->pdo;
      $stmt = $pdo->prepare(
        "SELECT * FROM otp_tb 
          WHERE email = :email AND otp_code = :otp_code AND purpose = :purpose 
          ORDER BY otp_id DESC 
          LIMIT 1"
      );
      $stmt->execute([
        ":email" => $user_email,
        ":otp_code" => $otp_code,
        ":purpose" => $purpose
      ]);
      $otp = $stmt->fetch();

      if (!$otp || strtotime($otp["expires_at"]) < time()) {
        return false;
      }

      $cleanup = $pdo->prepare("DELETE FROM otp_tb WHERE otp_id = ?");
      $cleanup->execute([$otp['otp_id']]);

      return true;
    } catch (PDOException $e) {
      error_log("OTP Verification Error: " . $e->getMessage());
      return false;
    }
  }
}
