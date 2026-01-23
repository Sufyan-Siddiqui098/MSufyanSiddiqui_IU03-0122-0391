<?php 

$conn = mysqli_connect("localhost", 'root', '', 'test', '3307');
$query = 'select * from product';
$result = mysqli_query($conn, $query);

$data = mysqli_fetch_all($result, MYSQLI_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
</head>
<body>
    <table>
        <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
        </thead>
        <tbody>
            <?php
            for($i=0; $i<count($data); $i++){
                ?>

                <tr>
                    <td> <?php echo $data[$i]['id'] ?> </td>
                    <td> <?php echo $data[$i]['name'] ?> </td>
                    <td> <?php echo $data[$i]['category'] ?> </td>
                    <td> <?php echo $data[$i]['quantity'] ?> </td>
                    <td> <?php echo $data[$i]['price'] ?> </td>
                    <td class="d-flex gap-2 "> 
                        <a href="edit.php?id=<?php echo $data[$i]['id']?>">Edit</a> 
                        <a href="delete.php?id=<?php echo $data[$i]['id']?>">Delete</a> 
                    </td>

                </tr>

                <?php 
            }
            ?>
        </tbody>
    </table>
</body>
</html>