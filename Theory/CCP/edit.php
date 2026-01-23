<?php
// Validate product_id
$id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

if ($id <= 0) {
    die('Invalid product ID!');
}

$conn = mysqli_connect('localhost', 'root', '', 'e_commerce', '3307');

// Use prepared statement to prevent SQL injection
$stmt = mysqli_prepare($conn, "SELECT * FROM products WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_stmt_close($stmt);

if (empty($data)) {
    die('Product not found!');
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Product</title>
  <script src="../../bootstrap/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
</head>

<body>
  <div class="container mt-5">
    <h1 class="py-3">Edit Product</h1>
    <form method="post" action="editForrmSubmit.php" onsubmit="return validateEditForm()">
      <div class="form-group" style="margin: 10px;">
        <input value="<?php echo $data[0]['id']?>" type="hidden" class="form-control" name="product_id">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label for="">Product Name</label>
        <input value="<?php echo $data[0]['product_name']?>" type="text" class="form-control" name="product_name" id="product_name" placeholder="Enter product name">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Category</label>
        <input value="<?php echo $data[0]['product_category']?>" type="text" class="form-control" name="product_category" id="product_category" placeholder="Enter product category">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Price</label>
        <input value="<?php echo $data[0]['product_price']?>" type="number" class="form-control" name="product_price" id="product_price" placeholder="Enter product price">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Quantity</label>
        <input value="<?php echo $data[0]['product_quantity']?>" type="number" class="form-control" name="product_quantity" id="product_quantity" placeholder="Enter product quantity">
      </div>

      <input type="submit" class="btn btn-primary" style="margin: 10px;" value="Submit">
    </form>
  </div>

  <script>
    function SubmitForm() {
      var firvalidateEditForm() {
      // Get values
      var productName = document.getElementById('product_name').value.trim();
      var productCategory = document.getElementById('product_category').value.trim();
      var productPrice = document.getElementById('product_price').value;
      var productQuantity = document.getElementById('product_quantity').value;
      
      // Regex patterns
      var nameRegex = /^[a-zA-Z0-9\s\-_]{3,100}$/;
      var categoryRegex = /^[a-zA-Z0-9\s\-_]{3,50}$/;
      var priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
      var quantityRegex = /^[0-9]+$/;
      
      // Validate Product Name
      if (productName === '') {
        alert('Product name is required!');
        return false;
      }
      if (!nameRegex.test(productName)) {
        alert('Product name must be 3-100 characters and contain only letters, numbers, spaces, hyphens, or underscores!');
        return false;
      }
      
      // Validate Product Category
      if (productCategory === '') {
        alert('Product category is required!');
        return false;
      }
      if (!categoryRegex.test(productCategory)) {
        alert('Product category must be 3-50 characters and contain only letters, numbers, spaces, hyphens, or underscores!');
        return false;
      }
      
      // Validate Product Price
      if (productPrice === '') {
        alert('Product price is required!');
        return false;
      }
      if (!priceRegex.test(productPrice) || parseFloat(productPrice) <= 0) {
        alert('Product price must be a valid positive number!');
        return false;
      }
      
      // Validate Product Quantity
      if (productQuantity === '') {
        alert('Product quantity is required!');
        return false;
      }
      if (!quantityRegex.test(productQuantity) || parseInt(productQuantity) <= 0) {
        alert('Product quantity must be a valid positive integer!');
        return false;
      }
      
      return true;
  </script>
</body>

</html>