    <?php
    // Validate product_id
    $id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

    if ($id <= 0) {
        die('Invalid product ID!');
    }

    $conn = mysqli_connect('localhost', 'root', '', 'e_commerce', '3307');

    // Use prepared statement to prevent SQL injection
    $stmt = mysqli_prepare($conn, "DELETE FROM products WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    header('Location: index.php');
    exit();