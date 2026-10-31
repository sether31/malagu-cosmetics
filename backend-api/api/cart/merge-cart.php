<?php
require_once "../../config/Database.php";
require_once "../../classes/JwtHandler.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();

$data = json_decode(file_get_contents("php://input"), true);
$local_cart = $data["cart"] ?? [];

try {
  $pdo = (new Database)->pdo;
  $pdo->beginTransaction();

  $cartStmt = $pdo->prepare("SELECT * FROM cart_tb WHERE user_id = :user_id LIMIT 1");
  $cartStmt->execute([':user_id' => $user_id]);
  $cart = $cartStmt->fetch();

  if (!$cart) {
    $createCart = $pdo->prepare("INSERT INTO cart_tb (user_id) VALUES (:user_id)");
    $createCart->execute(["user_id" => $user_id]);
    $cart_id = $pdo->lastInsertId();
  } else {
    $cart_id = $cart["cart_id"];
  }

  foreach ($local_cart as $item) {
    $variant_id = $item["selectedVariant"]["id"];
    $quantity = min((int)$item["quantity"], 100);

    $stmt = $pdo->prepare(
      "SELECT * FROM cart_item_tb 
      WHERE cart_id = :cart_id AND products_variant_id = :products_variant_id"
    );
    $stmt->execute([
      ':cart_id' => $cart_id,
      ':products_variant_id' => $variant_id
    ]);
    $existing = $stmt->fetch();

    if ($existing) {
      $new_qty = min($existing['quantity'] + $quantity, 100);
      $updateStmt = $pdo->prepare("UPDATE cart_item_tb SET quantity = :qty WHERE cart_item_id = :cart_item_id");
      $updateStmt->execute([
        ':qty' => $new_qty,
        ':cart_item_id' => $existing['cart_item_id']
      ]);
    } else {
      $insertItem = $pdo->prepare(
        "INSERT INTO cart_item_tb (cart_id, products_variant_id, quantity) VALUES (:cart_id, :products_variant_id, :quantity)"
      );
      $insertItem->execute([
        ':cart_id' => $cart_id,
        ':products_variant_id' => $variant_id,
        ':quantity' => $quantity
      ]);
    }
  }

  $pdo->commit();
  echo json_encode([
    "success" => true,
    "message" => "Cart merged successfully."
  ]);
} catch (\Throwable $th) {
  $pdo->rollback();
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Database error during cart merge: " . $th->getMessage()
  ]);
}
