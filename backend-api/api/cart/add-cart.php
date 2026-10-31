<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();

$data = json_decode(file_get_contents("php://input"), true);
$variant_id = $data['variant_id'] ?? "";
$quantity = min((int)($data['quantity'] ?? 1), 100);

if (!$variant_id) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Variant ID is required."]);
  exit;
}

try {
  $pdo = (new Database())->pdo;
  $stmt = $pdo->prepare("SELECT cart_id FROM cart_tb WHERE user_id = :user_id LIMIT 1");
  $stmt->execute([":user_id" => $user_id]);
  $cart = $stmt->fetch();

  if (!$cart) {
    $newCart = $pdo->prepare("INSERT INTO cart_tb (user_id) VALUES (:user_id)");
    $newCart->execute([":user_id" => $user_id]);
    $cart_id = $pdo->lastInsertId();
  } else {
    $cart_id = $cart["cart_id"];
  }

  $stmt = $pdo->prepare("SELECT cart_item_id, quantity FROM cart_item_tb WHERE cart_id = :cart_id AND products_variant_id = :pv_id");
  $stmt->execute([
    ":cart_id" => $cart_id,
    ":pv_id" => $variant_id
  ]);
  $existing = $stmt->fetch();

  if ($existing) {
    $new_qty = min((int)$existing["quantity"] + $quantity, 100);
    $stmt = $pdo->prepare("UPDATE cart_item_tb SET quantity = :qty WHERE cart_item_id = :ci_id");
    $stmt->execute([
      ":qty" => $new_qty,
      ":ci_id" => $existing["cart_item_id"]
    ]);
  } else {
    $stmt = $pdo->prepare("INSERT INTO cart_item_tb (cart_id, products_variant_id, quantity) VALUES (:cart_id, :pv_id, :qty)");
    $stmt->execute([
      ":cart_id" => $cart_id,
      ":pv_id" => $variant_id,
      ":qty" => $quantity
    ]);
  }

  echo json_encode([
    "success" => true,
    "message" => "Added to bag successfully!"
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $th->getMessage()
  ]);
}
