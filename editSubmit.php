<?php
$id = $_POST['id'];
$name = $_POST["name"];
$category = $_POST["category"];
$price = $_POST["price"];
$quantity = $_POST["quantity"];


$conn = mysqli_connect("localhost", 'root', '', 'test', '3307');
$query = "update product set 
            name='$name',  
            category='$category', 
            price='$price', 
            quantity='$quantity' 
            where id = '$id'";
$result = mysqli_query($conn, $query);

if ($result) {
    echo "Product Edited Successfuly!";
    header("Location: product.php");
}

?>