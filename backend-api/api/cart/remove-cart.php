<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"), true);
$parts = explode("-", $data["cart_item_id"]) ?? "";
$variant_id = $parts[1];

if (!$variant_id) {
  echo json_encode([
    "success" => false,
    "message" => "Variant not found."
  ]);
  exit;
}

try {
  $pdo = (new Database())->pdo;
  $stmt = $pdo->prepare("SELECT cart_id FROM cart_tb WHERE user_id = :user_id LIMIT 1");
  $stmt->execute([":user_id" => $user_id]);
  $cart = $stmt->fetch();

  if (!$cart) {
    echo json_encode([
      "success" => false,
      "message" => "Cart not found."
    ]);
    exit;
  }

  $stmt = $pdo->prepare("DELETE FROM cart_item_tb WHERE cart_id = :cart_id AND products_variant_id = :pv_id");
  $stmt->execute([
    ":cart_id" => $cart["cart_id"],
    ":pv_id" => $variant_id
  ]);

  echo json_encode([
    "success" => true,
    "message" => "Remove cart successfully!"
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $th->getMessage()
  ]);
}
