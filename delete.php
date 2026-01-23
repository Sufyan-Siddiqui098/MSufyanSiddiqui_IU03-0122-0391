<?php 
$id = $_GET['id'];
$conn = mysqli_connect("localhost", 'root', '', 'test', '3307');
$query = "delete from product where id = '$id'";
$result = mysqli_query($conn, $query);

if($result){
    echo "Product deleted Successfuly!";
    header("Location: product.php");
}

?>