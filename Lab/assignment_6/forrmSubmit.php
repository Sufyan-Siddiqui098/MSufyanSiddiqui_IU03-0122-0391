<?php
$conn = mysqli_connect('localhost', 'root', '', 'e_commerce');

$product_name = $_POST['product_name'] ?? '';
$product_category = $_POST['product_category'];
$product_price = $_POST['product_price'];
$product_quantity = $_POST['product_quantity'];


$query = "INSERT INTO products(product_name,product_category,product_price,product_quantity) 
values('$product_name','$product_category','$product_price','$product_quantity')";
if(mysqli_query($conn, $query)){
    $response ['msg'] = 'Data Inserted Successfully';
    $response ['code'] = '201';
    echo json_encode($response);
}
else
{
    $response ['msg'] = 'Something went wrong';
    $response ['code'] = '500';
    echo json_encode($response);
}


