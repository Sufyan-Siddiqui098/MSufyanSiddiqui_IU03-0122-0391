<?php
$conn = mysqli_connect('localhost', 'root', '', 'e_commerce', '3307');


// Use prepared statement
$stmt = mysqli_prepare($conn, "SELECT * FROM products");
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
mysqli_stmt_close($stmt);
mysqli_close($conn);

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products</title>
    <script src="../../bootstrap/js/bootstrap.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

</head>

<body class="container mt-5">
    <h1 class="my-4">Products List</h1>
    <a href="form.php" class="btn btn-primary my-4">Create</a>

    <table class="table table-bordered table-hover table-striped">
        <thead>
            <th>Sr</th>
            <th>Product Category</th>
            <th>Product Name</th>
            <th>Product Price</th>
            <th>Product Quantity</th>
            <th>Action</th>
        </thead>
        <tbody>
            <?php
            for ($i = 0; $i < count($data); $i++) {
                ?>
                <tr>
                    <td><?php echo $data[$i]['id'] ?></td>
                    <td><?php echo $data[$i]['product_category'] ?></td>
                    <td><?php echo $data[$i]['product_name'] ?></td>    
                    <td><?php echo $data[$i]['product_price'] ?></td>
                    <td><?php echo $data[$i]['product_quantity'] ?></td>
                    <td>
                        <a href="edit.php?product_id=<?php echo $data[$i]['id'] ?>">Edit</a>
                        <a href="delete.php?product_id=<?php echo $data[$i]['id'] ?>">Delete</a>
                    </td>
                </tr>
                <?php
            }
            ?>
        </tbody>
    </table>
</body>

</html>