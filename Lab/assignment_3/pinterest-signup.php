<?php

$host = 'localhost:3306';
$db = 'form_data';
$user = 'root';
$dbPassword = '123456789';

$tableName = "pinterest_users";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $success_message = '';
    $error_message = '';

    $email = htmlspecialchars($_POST['email'] ?? '');
    $password = htmlspecialchars($_POST['password'] ?? '');
    $age = (int)($_POST['age'] ?? 0);

    // Regex 
    $emailPattern = '/^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/';
    $passowrdPattern = '/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/';

    if (!preg_match($emailPattern, $email)) {
        $error_message = "Email is invalid";
        die("Email is invalid");
    }
    if (!preg_match($passowrdPattern, $password)) {
        $error_message = "Password should have atleast 1 special character, number and length of 8.";
        die("Password should have atleast 1 special character, number and length of 8.");
    }
    if (!filter_var($age, FILTER_VALIDATE_INT) || $age < 13) {
        $error_message = 'You must be at least 13 years old.';
        die('You must be at least 13 years old.');
    }
    

    $conn = new mysqli($host, $user, $dbPassword, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql_create_table = "CREATE TABLE IF NOT EXISTS `$tableName` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            age INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
    $conn->query($sql_create_table);

    $sql_insert = "INSERT INTO $tableName (email, password, age) VALUES (?,?,?)";
    if ($stmt = $conn->prepare($sql_insert)) {
        $stmt->bind_param("ssi", $email, $password, $age);
        if ($stmt->execute()) {
            $success_message = "Success! Account created for $email.";
        }
        $stmt->close();
    }

    $success_message = "Success! We received your data. Email: $email";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pinterest - Sign up</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-100 text-gray-900">
    <?php if (isset($success_message)) { echo "<div class='success fixed top-2 left-1/2 -translate-x-1/2 text-green-800 font-bold border border-green-200 px-4 py-3 rounded bg-green-100 mb-4'>" . $success_message . "</div>"; } ?>

    <div class="flex items-center justify-center min-h-screen p-4">
        <form action="" method="post" onsubmit="return validateForm()" class="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
            <h1 class="text-2xl font-semibold text-center">Welcome to Pinterest</h1>
            <p class="text-center text-sm text-gray-600">Find new ideas to try.</p>

            <div>
                <label for="email" class="block text-sm text-gray-700">Email</label>
                <input type="email" id="email" name="email" class="mt-1 w-full rounded border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="abc@gmail.com" />
            </div>
            <div>
                <label for="password" class="block text-sm text-gray-700">Create a password</label>
                <input type="password" id="password" name="password" class="mt-1 w-full rounded border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="********" />
            </div>
            <div>
                <label for="age" class="block text-sm text-gray-700">Age</label>
                <input type="number" id="age" name="age" min="1" class="mt-1 w-full rounded border-gray-300 focus:ring-red-500 focus:border-red-500" placeholder="e.g. 21" />
            </div>

            <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded py-2 mt-2">Continue</button>
        </form>
    </div>

    <script>
        const successMsg = document.querySelector('.success');
        if (successMsg) { setTimeout(() => successMsg.style.display = 'none', 2000); }

        function validateForm() {
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('password').value;
            const age = parseInt(document.getElementById('age').value);

            const emailPattern = /^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/;
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

            if (!emailPattern.test(email)) { alert('Please enter a valid email address'); return false; }
            if (!passwordPattern.test(pass)) { alert('Password must have at least one special character, a number and be at least 8 chars'); return false; }
            if (!Number.isInteger(age) || age < 13) { alert('You must be at least 13 years old'); return false; }
            return true;
        }
    </script>
</body>
</html>