<?php


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    

    $username = $_POST['username1'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $namePattern = "/^[A-Za-z]+$/";
    $emailPattern = "/^[A-Za-z]+[_.0-9]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/";
    $passowrdPattern = "/^[A-Za-z0-9_\-!@]{8,}$/";

    if (!preg_match($namePattern, $username)) {
        echo "Invalid username pattern ";
        return;
    }
    if (!preg_match($emailPattern, $email)) {
        echo "Invalid email pattern ";
        return;
    }
    if (!preg_match($passowrdPattern, $password)) {
        echo "Invalid password pattern $password";
        return;
    }
    $con = mysqli_connect('localhost', 'root', '', 'test' , 3307);

    $sql = "insert into user(username, email, password) values ('$username', '$email', '$password');";

    $result = mysqli_query($con, $sql);

    echo "--- Form Submitted Successfuly $result----";
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submitted Values</title>
</head>

<body>

    <div>
        <p>
          Username:  <?php echo $username ?>
        </p>
        <p>
          Email:   <?php echo $email ?>
        </p>
        <p>
         Password:   <?php echo $password ?>
        </p>
        
    </div>

</body>

</html>