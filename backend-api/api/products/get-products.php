<?php
require_once "../../config/Database.php";

$base_url = $_ENV['BASE_URL'];

try {
  $category = $_GET['category'] ?? null;
  $sub_category = $_GET['sub_category'] ?? null;
  $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
  $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 8;

  $sort = $_GET['sort'] ?? '';

  if ($page < 1) $page = 1;
  if ($limit < 1) $limit = 8;

  $offset = ($page - 1) * $limit;

  $pdo = (new Database())->pdo;

  $where_clause = [];
  $params = [];

  if ($category) {
    $where_clause[] = "category = :category";
    $params[":category"] = $category;
  }

  if ($sub_category) {
    $where_clause[] = "sub_category = :sub_category";
    $params[":sub_category"] = $sub_category;
  }

  $where_sql = "";
  if (count($where_clause) > 0) {
    $where_sql = "WHERE " . implode(" AND ", $where_clause);
  }

  $order_sql = "ORDER BY id DESC";
  if ($sort === 'price_low') {
    $order_sql = "ORDER BY price ASC";
  } elseif ($sort === 'price_high') {
    $order_sql = "ORDER BY price DESC";
  }

  $stmt = $pdo->prepare("SELECT COUNT(*) FROM products_tb $where_sql");
  $stmt->execute($params);
  $total_products = (int)$stmt->fetchColumn();
  $total_pages = $total_products > 0 ? (int)ceil($total_products / $limit) : 1;

  $stmt = $pdo->prepare(
    "SELECT 
      p.id AS product_id, p.name, p.brand, p.category, p.sub_category, p.description, p.price,
      v.id AS variant_id, v.color_name, v.hex_code, v.image_path
    FROM (
      SELECT * FROM products_tb 
      $where_sql
      $order_sql
      LIMIT :limit OFFSET :offset
    ) p 
    LEFT JOIN product_variants_tb v ON p.id = v.product_id
    "
  );

  foreach ($params as $key => $val) {
    $stmt->bindValue($key, $val);
  }

  $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
  $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
  $stmt->execute();
  $results = $stmt->fetchAll();

  $products = [];

  foreach ($results as $row) {
    $pid = $row["product_id"];

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

    if ($row["variant_id"]) {
      $products[$pid]["variants"][] = [
        "id" => $row['variant_id'],
        "product_id" => $pid,
        "color_name" => $row['color_name'],
        "hex_code" => $row['hex_code'],
        "image_path" => $base_url . $row['image_path']
      ];
    }
  }

  $finalProducts = array_values($products);

  echo json_encode([
    "success" => true,
    "data" => $finalProducts,
    "pagination" => [
      "currentPage" => $page,
      "totalPages" => $total_pages,
      "totalProducts" => $total_products,
      "limit" => $limit
    ]
  ]);
} catch (\Throwable $th) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Failed to fetch products: " . $th->getMessage()
  ]);
}
