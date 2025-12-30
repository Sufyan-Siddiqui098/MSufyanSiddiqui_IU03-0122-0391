<?php
header('Content-Type: application/json');
$conn = mysqli_connect('localhost:3307','root','','wpl');

$action = $_REQUEST['action'];

if($action == 'read'){
    $read = "SELECT * FROM products";
    
  $result = mysqli_query($conn,$read);
  echo json_encode(mysqli_fetch_all($result,MYSQLI_ASSOC));
}

if($action == 'fetch'){ 
        $fetch = "SELECT * FROM products WHERE id='$_GET[id]'";

  $result = mysqli_query($conn,$fetch);
  echo json_encode(mysqli_fetch_assoc($result));
}

if($action == 'create'){
$create = "INSERT INTO products(product_name,product_category,product_price,product_quantity) 
  VALUES(
    '$_POST[product_name]',
    '$_POST[product_category]',
    '$_POST[product_price]',
    '$_POST[product_quantity]'
  )";
  
  mysqli_query($conn,$create);
  
  echo json_encode(['msg'=>'Product created']);
}

if($action == 'update'){
    $update = "UPDATE products SET
    product_name='$_POST[product_name]',
    product_category='$_POST[product_category]',
    product_price='$_POST[product_price]',
    product_quantity='$_POST[product_quantity]'
    WHERE id='$_POST[product_id]'";

    mysqli_query($conn, $update);

  echo json_encode(['msg'=>'Product updated']);
}

if($action == 'delete'){
    $delete = "DELETE FROM products WHERE id='$_POST[id]'";

  mysqli_query($conn,$delete);
  echo json_encode(['msg'=>'Product deleted']);
}