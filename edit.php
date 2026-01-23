<?php
$id = $_GET['id'];
$conn = mysqli_connect("localhost", 'root', '', 'test', '3307');
$query = "select * from product where id = '$id'";
$result = mysqli_query($conn, $query);

$data = mysqli_fetch_assoc($result);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product | Form</title>
</head>

<body>

    <form method="post" action="editSubmit.php">
        <div>
            <input type="number" value="<?php echo $data['id']?>" name="id" id="id" hidden>
        </div>
        <div>
            <label for="name">Product Name:</label>
            <input type="text" name="name" id="name" placeholder="Janaan" value="<?php echo $data['name']?>">
        </div>

        <div>
            <label for="category">Category</label>
            <input type="text" name="category" id="category" value="<?php echo $data['category']?>">
        </div>

        <div>
            <label for="price">Price:</label>
            <input type="number" name="price" id="price" value="<?php echo $data['price']?>">
        </div>

        <div>
            <label for="quantity">Quantity:</label>
            <input type="number" name="quantity" id="quantity" value="<?php echo $data['quantity']?>">
        </div>

        <!-- <input type="submit" value="Submit"> -->
        <button>Submit</button>

    </form>

</body>

</html>