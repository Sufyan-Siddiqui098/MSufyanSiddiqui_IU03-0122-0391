<?php
$conn = mysqli_connect('localhost', 'root', '', 'e_commerce', '3307');

// Get input values
$product_name = isset($_POST['product_name']) ? trim($_POST['product_name']) : '';
$product_category = isset($_POST['product_category']) ? trim($_POST['product_category']) : '';
$product_price = isset($_POST['product_price']) ? trim($_POST['product_price']) : '';
$product_quantity = isset($_POST['product_quantity']) ? trim($_POST['product_quantity']) : '';

// Regex validation in PHP
$nameRegex = '/^[a-zA-Z0-9\s\-_]{3,100}$/';
$categoryRegex = '/^[a-zA-Z0-9\s\-_]{3,50}$/';
$priceRegex = '/^[0-9]+(\.[0-9]{1,2})?$/';
$quantityRegex = '/^[0-9]+$/';

// Validate inputs
if (empty($product_name) || !preg_match($nameRegex, $product_name)) {
    $response['msg'] = 'Invalid product name!';
    $response['code'] = '400';
    echo json_encode($response);
    exit();
}

if (empty($product_category) || !preg_match($categoryRegex, $product_category)) {
    $response['msg'] = 'Invalid product category!';
    $response['code'] = '400';
    echo json_encode($response);
    exit();
}

if (empty($product_price) || !preg_match($priceRegex, $product_price) || $product_price <= 0) {
    $response['msg'] = 'Invalid product price!';
    $response['code'] = '400';
    echo json_encode($response);
    exit();
}

if (empty($product_quantity) || !preg_match($quantityRegex, $product_quantity) || $product_quantity <= 0) {
    $response['msg'] = 'Invalid product quantity!';
    $response['code'] = '400';
    echo json_encode($response);
    exit();
}

// Use prepared statement to prevent SQL injection
$stmt = mysqli_prepare($conn, "INSERT INTO products(product_name, product_category, product_price, product_quantity) VALUES (?, ?, ?, ?)");
mysqli_stmt_bind_param($stmt, "ssdi", $product_name, $product_category, $product_price, $product_quantity);

if(mysqli_stmt_execute($stmt)){
    $response['msg'] = 'Data Inserted Successfully';
    $response['code'] = '201';
    echo json_encode($response);
}
else
{
    $response['msg'] = 'Something went wrong';
    $response['code'] = '500';
    echo json_encode($response);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);


