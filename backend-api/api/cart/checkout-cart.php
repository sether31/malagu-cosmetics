<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"), true);
$cart_item_ids = $data["cart_item_ids"] ?? [];

if (empty($cart_item_ids)) {
  echo json_encode([
    "success" => false,
    "message" => "No items selected for checkout."
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

  $cart_id = $cart["cart_id"];

  $pdo->beginTransaction();

  $stmtDelete = $pdo->prepare("DELETE FROM cart_item_tb WHERE cart_id = :cart_id AND products_variant_id = :pv_id");

  foreach ($cart_item_ids as $cart_item_id) {
    $parts = explode("-", $cart_item_id);
    if (isset($parts[1])) {
      $variant_id = $parts[1];
      $stmtDelete->execute([
        ":cart_id" => $cart_id,
        ":pv_id" => $variant_id
      ]);
    }
  }

  $pdo->commit();

  echo json_encode([
    "success" => true,
    "message" => "Checkout completed successfully!"
  ]);
} catch (\Throwable $th) {
  if (isset($pdo) && $pdo->inTransaction()) {
    $pdo->rollBack();
  }
  echo json_encode([
    "success" => false,
    "message" => "Failed to process checkout."
  ]);
}
