<?php
require_once "../../config/Database.php";

try {
  $pdo = (new Database())->pdo;

  $stmt = $pdo->prepare(
    "SELECT DISTINCT category, sub_category 
    FROM products_tb 
    WHERE category IS NOT NULL AND sub_category IS NOT NULL
    ORDER BY category ASC, sub_category ASC"
  );
  $stmt->execute();
  $rows = $stmt->fetchAll();

  $categoriesMap = [];

  foreach ($rows as $row) {
    $category = $row['category'];
    $subCategory = $row['sub_category'];

    if (!isset($categoriesMap[$category])) {
      $categoriesMap[$category] = [];
    }

    if ($subCategory && !in_array($subCategory, $categoriesMap[$category])) {
      $categoriesMap[$category][] = $subCategory;
    }
  }

  echo json_encode($categoriesMap, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
