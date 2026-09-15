<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

class Mailer
{
  public static function sendOTP($otp_code, $to_email, $to_name, $purpose, $expires_at)
  {
    $mail = new PHPMailer(true);
    $display_purpose = str_replace("_", " ", $purpose);
    $readable_time = date("F j, Y, g:i a", strtotime($expires_at));

    try {
      // Server settings
      $mail->SMTPDebug = SMTP::DEBUG_OFF;
      $mail->isSMTP();
      $mail->Host       = 'smtp.gmail.com';
      $mail->SMTPAuth   = true;
      $mail->Username   = $_ENV["SMTP_USER"];
      $mail->Password   = $_ENV["SMTP_PASSWORD"];
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
      $mail->Port       = 465;

      // Recipients
      $mail->setFrom($_ENV["SMTP_USER"], $_ENV["SMTP_NAME"]);
      $mail->addAddress($to_email, $to_name);

      // Content
      $mail->isHTML(true);
      $mail->Subject = strtoupper($_ENV["SMTP_NAME"]) . " " . strtoupper($display_purpose) . " " . "OTP CODE";
      $mail->Body    = "
              <p>Hello <strong>$to_name</strong>,</p>
              <p>
                Your OTP code for $display_purpose is: 
                <strong>$otp_code</strong>
              </p>
              <p>This code will expire at $readable_time</p>
              <br>
              <p>
                Best regards,
                <br>
                {$_ENV['SMTP_NAME']}
              </p>
            ";

      $mail->send();
      return true;
    } catch (Exception $e) {
      error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
      return false;
    }
  }
}
