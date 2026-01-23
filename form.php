<?php 
if($_SERVER["REQUEST_METHOD"] === "POST"){
    $name = $_POST["name"];
    $category = $_POST["category"];
    $price = $_POST["price"];
    $quantity = $_POST["quantity"];

    $namePattern = "/^[a-zA-Z]+$/";
    $numberPattern = "/^[0-9]+$/";

    if(!preg_match($namePattern, $name)){
        echo "Invalid product name $name";
        return;
    }
    if(!preg_match($namePattern, $category)){
         echo "Invalid product category $category";
        return;
    }
    if(!preg_match($numberPattern, $price)){
        echo "Invalid product price $price";
        return ;
    }
    if(!preg_match($numberPattern, $quantity)){
        echo "Invalid product quantity $quantity";
        return;
    }

    $conn = mysqli_connect("localhost", 'root', '', 'test', '3307');
    $query = "insert into product(name, category, quantity, price) value('$name', '$category', '$quantity', '$price')";

    $result = mysqli_query($conn, $query);

    if($result){
        echo "Form submitted Successfuly!";
        header("Location: product.php");
    }


}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product | Form</title>
</head>
<body>

    <form method="post" action="">
        <div>
            <label for="name">Product Name:</label>
            <input type="text" name="name" id="name" placeholder="Janaan">
        </div>

        <div>
            <label for="category">Category</label>
            <input type="text" name="category" id="category">
        </div>

        <div>
            <label for="price">Price:</label>
            <input type="number" name="price" id="price">
        </div>

        <div>
            <label for="quantity">Quantity:</label>
            <input type="number" name="quantity" id="quantity">
        </div>

        <!-- <input type="submit" value="Submit"> -->
         <button>Submit</button>

    </form>

</body>
</html>