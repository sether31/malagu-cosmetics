<?php
require_once "../../config/Database.php";

$base_url = $_ENV['BASE_URL'] ?? '';

try {
  $productId = isset($_GET['productId']) ? (int)$_GET['productId'] : null;

  if (!$productId) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Product ID is required"]);
    exit;
  }

  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare(
    "SELECT 
      p.id AS product_id, p.name, p.brand, p.category, p.sub_category, p.description, p.price,
      v.id AS variant_id, v.color_name, v.hex_code, v.image_path
    FROM products_tb p 
    LEFT JOIN product_variants_tb v ON p.id = v.product_id
    WHERE p.id = :productId"
  );

  $stmt->execute([":productId" => $productId]);
  $results = $stmt->fetchAll();

  if (count($results) === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Product not found"]);
    exit;
  }

  $product = null;

  foreach ($results as $row) {
    if (!$product) {
      $product = [
        "id" => $row["product_id"],
        "name" => $row['name'],
        "brand" => $row['brand'],
        "category" => $row['category'],
        "sub_category" => $row['sub_category'],
        "description" => $row['description'],
        "price" => (float)$row['price'],
        "variants" => []
      ];
    }

    if ($row["variant_id"]) {
      $product["variants"][] = [
        "id" => $row['variant_id'],
        "color_name" => $row['color_name'],
        "hex_code" => $row['hex_code'],
        "image_path" => $base_url . $row['image_path']
      ];
    }
  }

  echo json_encode([
    "success" => true,
    "data" => $product
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Failed to fetch product: " . $th->getMessage()
  ]);
}
