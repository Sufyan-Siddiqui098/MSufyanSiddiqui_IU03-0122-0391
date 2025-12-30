<?php $id = $_GET['id'] ?? ''; ?>

<!DOCTYPE html>
<html>
<head>
<title>Product Form</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>

<body>
<div class="container mt-4">

<a href="index.php" class="btn btn-secondary mb-3">Back</a>

<div class="container">
  <form>
    <input type="hidden" id="product_id" value="<?php echo $id; ?>">
      <div class="form-group" style="margin: 10px;">
        <label for="">Product Name</label>
        <input type="text" class="form-control" id="product_name" name="product_name" placeholder="Enter product name">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Category</label>
        <input type="text" class="form-control" id="product_category" name="product_category" placeholder="Enter product category">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Price</label>
        <input type="number" class="form-control" id="product_price" name="product_price" placeholder="Enter product price">
      </div>
      <div class="form-group" style="margin: 10px;">
        <label>Product Quantity</label>
        <input type="number" class="form-control" id="product_quantity" name="product_quantity" placeholder="Enter product quantity">
      </div>

      <button id="submitbutton" type="button" class="btn btn-primary" style="margin: 10px;" value="Submit">
      <?php echo $id ? 'Update' : 'Save'; ?>

    </form>

  </div>
</div>

<script>
$(document).ready(function(){

  let id = $('#product_id').val();

  if(id){
    $.ajax({
      type: 'GET',      
      url: 'api.php',   
      data: { action: 'fetch', id: id }, 
      dataType: 'json',   
      success: function(data){
      $('#product_name').val(data.product_name);
      $('#product_category').val(data.product_category);
      $('#product_price').val(data.product_price);
      $('#product_quantity').val(data.product_quantity);
      }
    });
  }

  $('#submitbutton').click(function(){
    let action;

    if(id) {
        action = 'update';
    } else {
        action = 'create';
    }

    let data={
      action: action,
      product_id: $('#product_id').val(),
      product_name:$('#product_name').val(),
      product_category:$('#product_category').val(),
      product_price:$('#product_price').val(),
      product_quantity:$('#product_quantity').val()
    };

    $.ajax( {
        type : 'POST',
        url : 'api.php',
        data : data,
        success: function() {
            window.location='index.php';
        }
    })

  });

});
</script>

</body>
</html>