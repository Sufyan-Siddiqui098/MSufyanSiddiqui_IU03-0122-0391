<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Product</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

</head>

<body>
  <div class="container mt-5   ">
    <h1 class="py-3">Create Product</h1>
    <a href="index.php" class="btn btn-primary my-4">Product List</a>

    <form>
      <div class="form-group" style="margin: 10px;">
        <label for="">Product Name</label>
        <input type="text" class="form-control" name="product_name" id="product_name" placeholder="Enter product name">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Category</label>
        <input type="text" class="form-control" name="product_category" id="product_category" placeholder="Enter product category">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Price</label>
        <input type="number" class="form-control" name="product_price" id="product_price" placeholder="Enter product price">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Quantity</label>
        <input type="number" class="form-control" name="product_quantity" id="product_quantity" placeholder="Enter product quantity">
      </div>

      <input type="button" class="btn btn-primary" id="submitbutton" style="margin: 10px;" value="Submit">
    </form>
  </div>

  <script>
      // jQuery with Regex Validation
    $(document).ready(function() {
      $('#submitbutton').click(function(){
        // Get values
        var productName = $('#product_name').val().trim();
        var productCategory = $('#product_category').val().trim();
        var productPrice = $('#product_price').val();
        var productQuantity = $('#product_quantity').val();
        
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
        
        // If all validations pass, submit data
        let data = {
          'product_name': productName,
          'product_category': productCategory,
          'product_price': productPrice,
          'product_quantity': productQuantity
        }
        
        $.ajax({
          type: 'POST',
          url: 'forrmSubmit.php',
          data: data,
          success: function(response){
            console.log(response);
            var result = JSON.parse(response);
            alert(result.msg);
            if(result.code === '201') {
              // Clear form on success
              $('#product_name').val('');
              $('#product_category').val('');
              $('#product_price').val('');
              $('#product_quantity').val('');
            }
          },
          error: function() {
            alert('Error submitting form!');
          }
        });
      });
    });
  </script>
</body>

</html>