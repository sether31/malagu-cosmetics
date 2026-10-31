<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();
$data = json_decode(file_get_contents("php://input"), true);

$old_cart_item_id = $data["old_cart_item_id"] ?? "";
$new_cart_item_id = $data["new_cart_item_id"] ?? "";

$old_parts = explode("-", $old_cart_item_id);
$new_parts = explode("-", $new_cart_item_id);

$old_variant_id = $old_parts[1] ?? null;
$new_variant_id = $new_parts[1] ?? null;
$quantity = min((int)$data["quantity"], 100);
$action = $data["action"] ?? "";

if (!$old_variant_id || !$new_variant_id) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid variant IDs."]);
  exit;
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare("SELECT cart_id FROM cart_tb WHERE user_id = :user_id LIMIT 1");
  $stmt->execute([":user_id" => $user_id]);
  $cart = $stmt->fetch();

  if (!$cart) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Cart not found."]);
    exit;
  }

  $cart_id = $cart["cart_id"];

  $pdo->beginTransaction();

  if ($action === "merge") {
    $stmtDelete = $pdo->prepare("DELETE FROM cart_item_tb WHERE cart_id = :cart_id AND products_variant_id = :pv_id");
    $stmtDelete->execute([
      ":cart_id" => $cart_id,
      ":pv_id" => $old_variant_id
    ]);

    $stmtUpdate = $pdo->prepare("UPDATE cart_item_tb SET quantity = :qty WHERE cart_id = :cart_id AND products_variant_id = :pv_id");
    $stmtUpdate->execute([
      ":qty" => $quantity,
      ":cart_id" => $cart_id,
      ":pv_id" => $new_variant_id
    ]);
  } else {
    $stmtUpdate = $pdo->prepare("UPDATE cart_item_tb SET products_variant_id = :new_pv_id AND quantity = :qty WHERE cart_id = :cart_id AND products_variant_id = :old_pv_id AND ");
    $stmtUpdate->execute([
      ":new_pv_id" => $new_variant_id,
      ":qty" => $quantity,
      ":cart_id" => $cart_id,
      ":old_pv_id" => $old_variant_id
    ]);
  }

  $pdo->commit();

  echo json_encode([
    "success" => true,
    "message" => "Variant updated successfully!"
  ]);
} catch (\Throwable $th) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => $th->getMessage()
  ]);
}
