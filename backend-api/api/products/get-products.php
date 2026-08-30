<?php
require_once "../../config/Database.php";

$baseUrl = $_ENV['BASE_URL'];

try {
  $pdo = (new Database)->pdo;

  // get url params
  $category = $_GET['category'] ?? null;
  $subCategory = $_GET['sub_category'] ?? null;
  $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;

  // where clause dynamic
  $whereClauses = [];
  $params = [];

  if ($category) {
    $whereClauses[] = "category = :category";
    $params[':category'] = $category;
  }

  if ($subCategory) {
    $whereClauses[] = "sub_category = :sub_category";
    $params[':sub_category'] = $subCategory;
  }

  $whereSql = "";
  if (count($whereClauses) > 0) {
    $whereSql = "WHERE " . implode(" AND ", $whereClauses);
  }

  $limitSql = "";
  if ($limit && $limit > 0) {
    $limitSql = "LIMIT $limit";
  }



  $stmt = $pdo->prepare(
    "SELECT
      p.id AS product_id, p.name, p.brand, p.category, p.sub_category, p.description, p.price,
      v.id AS variant_id, v.color_name, v.hex_code, v.image_path
    FROM (
      SELECT * FROM products_tb 
      $whereSql 
      $limitSql
    ) p
    LEFT JOIN product_variants_tb v ON p.id = v.product_id"
  );

  $stmt->execute($params);
  $results = $stmt->fetchAll();

  $products = [];

  foreach ($results as $row) {
    $pid = $row['product_id'];

    if (!isset($products[$pid])) {
      $products[$pid] = [
        "id" => $pid,
        "name" => $row['name'],
        "brand" => $row['brand'],
        "category" => $row['category'],
        "sub_category" => $row['sub_category'],
        "description" => $row['description'],
        "price" => (float)$row['price'],
        "variants" => []
      ];
    }

    if ($row['variant_id']) {
      $products[$pid]['variants'][] = [
        "id" => $row['variant_id'],
        "product_id" => $pid,
        "color_name" => $row['color_name'],
        "hex_code" => $row['hex_code'],
        "image_path" => $baseUrl . $row['image_path']
      ];
    }
  }

  $finalProducts = array_values($products);

  echo json_encode([
    "success" => true,
    "data" => $finalProducts
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Failed to fetch products: " . $th->getMessage()
  ]);
}
