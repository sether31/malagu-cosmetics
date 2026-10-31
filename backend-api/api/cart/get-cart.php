<?php
require_once "../../config/Database.php";
require_once "../../middleware/auth.php";

$user_id = getAuthenticatedUserId();

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare(
    "SELECT 
      ci.cart_item_id,
      ci.quantity,
      pv.id AS variant_id,
      pv.color_name,
      pv.hex_code,
      pv.image_path,
      p.id AS product_id,
      p.name AS product_name,
      p.price
    FROM cart_tb c 
    JOIN cart_item_tb ci ON c.cart_id = ci.cart_id
    JOIN product_variants_tb pv ON ci.products_variant_id = pv.id
    JOIN products_tb p ON pv.product_id = p.id
    WHERE c.user_id = :user_id"
  );
  $stmt->execute([':user_id' => $user_id]);
  $rows = $stmt->fetchAll();

  $cart_items = [];
  foreach ($rows as $row) {
    $variantStmt = $pdo->prepare("SELECT id, color_name, hex_code, image_path FROM product_variants_tb WHERE product_id = :product_id");
    $variantStmt->execute([':product_id' => $row['product_id']]);
    $variants = $variantStmt->fetchAll();

    $cart_items[] = [
      "cartItemId" => $row["product_id"] . "-" . $row["variant_id"],
      "quantity" => (int)$row["quantity"],
      "product" => [
        "id" => $row["product_id"],
        "name" => $row["product_name"],
        "price" => $row["price"],
        "variants" => $variants
      ],
      "selectedVariant" => [
        "id" => $row["variant_id"],
        "color_name" => $row["color_name"],
        "image_path" => $_ENV["BASE_URL"] . $row["image_path"]
      ]
    ];
  }

  echo json_encode(["success" => true, "cart" => $cart_items]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Error fetching cart: " . $th->getMessage()]);
}
