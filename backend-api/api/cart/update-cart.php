<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"), true);
$cart_item_id = $data["cart_item_id"] ?? "";
$parts = explode("-", $cart_item_id);
$variant_id = $parts[1] ?? null;
$quantity = min((int)($data['quantity'] ?? 1), 100);

if (!$variant_id) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid cart item."]);
  exit;
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare("SELECT cart_id FROM cart_tb WHERE user_id = :user_id");
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

  $stmt = $pdo->prepare("UPDATE cart_item_tb SET quantity = :qty WHERE cart_id = :cart_id AND products_variant_id = :pv_id");
  $stmt->execute([
    ":qty" => $quantity,
    ":cart_id" => $cart_id,
    ":pv_id" => $variant_id
  ]);

  echo json_encode([
    "success" => true,
    "message" => "Quantity updated successfully!"
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $th->getMessage()
  ]);
}
