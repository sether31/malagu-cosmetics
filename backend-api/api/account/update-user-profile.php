<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();
$name = $_POST["name"] ?? null;
$uploaded_pp_path = null;

try {
  $pdo = (new Database())->pdo;

  $stmtFetch = $pdo->prepare("SELECT profile_picture, full_name FROM user_tb WHERE user_id = :user_id LIMIT 1");
  $stmtFetch->execute([":user_id" => $user_id]);
  $user = $stmtFetch->fetch();

  if (!$user) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found."]);
    exit;
  }

  if (isset($_FILES["profile_picture"]) && $_FILES["profile_picture"]["error"] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES["profile_picture"]["tmp_name"];
    $fileName = $_FILES["profile_picture"]["name"];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    $allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    if (in_array($fileExtension, $allowedExtensions)) {
      $newFileName = md5(time() . $fileName) . "." . $fileExtension;
      $uploadFileDir = __DIR__ . "/../../uploads/user/";

      if (!is_dir($uploadFileDir)) {
        mkdir($uploadFileDir, 0755, true);
      }

      $dest_path = $uploadFileDir . $newFileName;
      if (move_uploaded_file($fileTmpPath, $dest_path)) {
        $uploaded_pp_path = "/uploads/user/" . $newFileName;

        if (!empty($user["profile_picture"])) {
          $oldFileServerPath = __DIR__ . "/../.." . $user["profile_picture"];
          if (file_exists($oldFileServerPath)) {
            @unlink($oldFileServerPath);
          }
        }
      }
    }
  }

  $finalName = (!empty($name)) ? $name : $user["full_name"];
  $finalPp = ($uploaded_pp_path !== null) ? $uploaded_pp_path : $user["profile_picture"];

  $stmt = $pdo->prepare(
    "UPDATE user_tb SET 
      profile_picture = :pp,
      full_name = :name
    WHERE user_id = :user_id"
  );

  $stmt->execute([
    ":pp" => $finalPp,
    ":name" => $finalName,
    ":user_id" => $user_id
  ]);

  $stmtGet = $pdo->prepare("SELECT user_id, profile_picture, full_name, email FROM user_tb WHERE user_id = :user_id LIMIT 1");
  $stmtGet->execute([":user_id" => $user_id]);
  $updatedUser = $stmtGet->fetch();

  echo json_encode([
    "success" => true,
    "message" => "Profile updated successfully!",
    "user" => [
      "user_id" => $updatedUser["user_id"],
      "profile_picture" => $updatedUser["profile_picture"],
      "name" => $updatedUser["full_name"],
      "email" => $updatedUser["email"]
    ]
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => $th->getMessage()]);
}
