<?php
require_once "../../config/Database.php";

$query = trim($_GET["q"] ?? "");
$limit = isset($_GET["limit"]) ? (int)$_GET["limit"] : 5;

if ($limit < 1) $limit = 5;

if (empty($query)) {
  echo json_encode([
    "success" => true,
    "products" => []
  ]);
  exit();
}

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare(
    "SELECT 
      p.id AS product_id, p.name, p.brand, p.category, p.sub_category, p.description, p.price,
      v.id AS variant_id, v.color_name, v.hex_code, v.image_path
    FROM (
      SELECT id, name, brand, category, sub_category, description, price 
      FROM products_tb 
      WHERE name LIKE :query 
      ORDER BY id DESC 
      LIMIT :limit
    ) p 
    LEFT JOIN product_variants_tb v ON p.id = v.product_id"
  );

  $searchTerm = "%" . $query . "%";
  $stmt->bindValue(":query", $searchTerm, PDO::PARAM_STR);
  $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
  $stmt->execute();

  $results = $stmt->fetchAll();

  $products = [];

  foreach ($results as $row) {
    $pid = $row["product_id"];

    if (!isset($products[$pid])) {
      $firstImage = null;
      if (!empty($row['image_path'])) {
        $firstImage = $row['image_path'];
      }

      $products[$pid] = [
        "id" => $pid,
        "name" => $row['name'],
        "brand" => $row['brand'],
        "category" => $row['category'],
        "sub_category" => $row['sub_category'],
        "description" => $row['description'],
        "price" => (float)$row['price'],
        "image" => $firstImage,
        "variants" => []
      ];
    }

    if ($row["variant_id"]) {
      if (!$products[$pid]["image"] && !empty($row['image_path'])) {
        $products[$pid]["image"] = $row['image_path'];
      }

      $products[$pid]["variants"][] = [
        "id" => $row['variant_id'],
        "product_id" => $pid,
        "color_name" => $row['color_name'],
        "hex_code" => $row['hex_code'],
        "image_path" => $row['image_path']
      ];
    }
  }

  $finalProducts = array_values($products);

  echo json_encode([
    "success" => true,
    "products" => $finalProducts
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Failed to search products: " . $th->getMessage()
  ]);
}
