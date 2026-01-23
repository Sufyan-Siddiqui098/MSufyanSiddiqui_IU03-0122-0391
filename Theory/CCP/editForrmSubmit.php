        <?php

        $conn = mysqli_connect('localhost', 'root', '', 'e_commerce', '3307');

        // Get and validate input values
        $id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        $product_name = isset($_POST['product_name']) ? trim($_POST['product_name']) : '';
        $product_category = isset($_POST['product_category']) ? trim($_POST['product_category']) : '';
        $product_price = isset($_POST['product_price']) ? trim($_POST['product_price']) : '';
        $product_quantity = isset($_POST['product_quantity']) ? trim($_POST['product_quantity']) : '';

        // Regex validation in PHP
        $nameRegex = '/^[a-zA-Z0-9\s\-_]{3,100}$/';
        $categoryRegex = '/^[a-zA-Z0-9\s\-_]{3,50}$/';
        $priceRegex = '/^[0-9]+(\.[0-9]{1,2})?$/';
        $quantityRegex = '/^[0-9]+$/';

        // Validate inputs
        if ($id <= 0) {
            die('Invalid product ID!');
        }

        if (empty($product_name) || !preg_match($nameRegex, $product_name)) {
            die('Invalid product name!');
        }

        if (empty($product_category) || !preg_match($categoryRegex, $product_category)) {
            die('Invalid product category!');
        }

        if (empty($product_price) || !preg_match($priceRegex, $product_price) || $product_price <= 0) {
            die('Invalid product price!');
        }

        if (empty($product_quantity) || !preg_match($quantityRegex, $product_quantity) || $product_quantity <= 0) {
            die('Invalid product quantity!');
        }

        // Use prepared statement to prevent SQL injection
        $stmt = mysqli_prepare($conn, "UPDATE products SET product_name = ?, product_category = ?, product_price = ?, product_quantity = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "ssdii", $product_name, $product_category, $product_price, $product_quantity, $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        mysqli_close($conn);

        header('Location: index.php');
        exit();
