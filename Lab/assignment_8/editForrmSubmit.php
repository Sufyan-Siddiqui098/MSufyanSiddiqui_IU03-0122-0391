<?php

// echo "<pre>";
// print_r($_POST);
// echo "</pre>";
// die();

$conn = mysqli_connect('localhost', 'root', '', 'e_commerce');

$id = $_POST['product_id'];
$product_name = $_POST['product_name'];
$product_category = $_POST['product_category'];
$product_price = $_POST['product_price'];
$product_quantity = $_POST['product_quantity'];


$query = "update products set
product_name = '$product_name',
product_category = '$product_category',
product_price = '$product_price',
product_quantity = '$product_quantity'
where id = '$id' ";
mysqli_query($conn, $query);
header('Location: '.'index.php');
