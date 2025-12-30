<?php

$host = 'localhost:3306';
$db = 'form_data';
$user = 'root';
$dbPassword = '123456789';

$tableName = "instagram_users";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $success_message = '';
    $error_message = '';

    $email = htmlspecialchars($_POST['email'] ?? '');
    $fullName = htmlspecialchars($_POST['fullName'] ?? '');
    $username = htmlspecialchars($_POST['username'] ?? '');
    $password = htmlspecialchars($_POST['password'] ?? '');
    $dob_day = intval($_POST['dob_day'] ?? 0);
    $dob_month = intval($_POST['dob_month'] ?? 0);
    $dob_year = intval($_POST['dob_year'] ?? 0);

    // Regex 
    $emailPattern = '/^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/';
    $namePattern = '/^[a-zA-Z]+$/';
    $passowrdPattern = '/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/';

    if (!checkdate($dob_month, $dob_day, $dob_year)) {
        $error_message = "Invalid date of birth";
        die("Invalid date of birth");
    }
    $dob = DateTime::createFromFormat('Y-m-d', sprintf('%04d-%02d-%02d', $dob_year, $dob_month, $dob_day));
   

    if (!preg_match($emailPattern, $email)) {
        $error_message = "Email is invalid";
        die("Email is invalid");
    }
    if (!preg_match($namePattern, $fullName)) {
        $error_message = "Full name should only have alphabets";
        die("Full name should only have alphabets");
    }
    if (!preg_match($passowrdPattern, $password)) {
        $error_message = "Password should have atleast 1 special character, number and length of 8.";
        die("Password should have atleast 1 special character, number and length of 8.");
    }
    if ($username === '') {
        $error_message = "Username is required";
        die("Username is required");
    }

    $conn = new mysqli($host, $user, $dbPassword, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql_create_table = "CREATE TABLE IF NOT EXISTS `$tableName` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL UNIQUE,
            full_name VARCHAR(150) NOT NULL,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            dob DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
    $conn->query($sql_create_table);

    $sql_insert = "INSERT INTO $tableName (email, full_name, username, password, dob) VALUES (?,?,?,?,?)";
    if ($stmt = $conn->prepare($sql_insert)) {
        $dob_sql = $dob->format('Y-m-d');
        $stmt->bind_param("sssss", $email, $fullName, $username, $password, $dob_sql);
        if ($stmt->execute()) {
            $success_message = "Success! Account for @$username created.";
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
    <title>Instagram - Sign up</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-100 text-gray-900">
    <?php if (isset($success_message)) { echo "<div class='success fixed top-2 left-1/2 -translate-x-1/2 text-green-800 font-bold border border-green-200 px-4 py-3 rounded bg-green-100 mb-4'>" . $success_message . "</div>"; } ?>

    <div class="flex items-center justify-center min-h-screen p-4">
        <form action="" method="post" onsubmit="return validateForm()" class="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
            <h1 class="text-2xl font-semibold text-center">Sign up</h1>
            <p class="text-center text-sm text-gray-600">Create an account to see photos and videos from your friends.</p>

            <div>
                <label for="email" class="block text-sm text-gray-700">Mobile Number or Email</label>
                <input type="email" id="email" name="email" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="abc@gmail.com" />
            </div>
            <div>
                <label for="fullName" class="block text-sm text-gray-700">Full Name</label>
                <input type="text" id="fullName" name="fullName" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Full Name" />
            </div>
            <div>
                <label for="username" class="block text-sm text-gray-700">Username</label>
                <input type="text" id="username" name="username" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="username" />
            </div>
            <div>
                <label for="password" class="block text-sm text-gray-700">Password</label>
                <input type="password" id="password" name="password" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="********" />
            </div>

            <div>
                <label class="block text-sm text-gray-700">Birthday</label>
                <div class="mt-1 grid grid-cols-3 gap-2">
                    <select name="dob_day" id="dob_day" class="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Day</option>
                        <?php for($d=1;$d<=31;$d++){ echo "<option value='$d'>$d</option>"; } ?>
                    </select>
                    <select name="dob_month" id="dob_month" class="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Month</option>
                        <?php for($m=1;$m<=12;$m++){ echo "<option value='$m'>$m</option>"; } ?>
                    </select>
                    <select name="dob_year" id="dob_year" class="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Year</option>
                        <?php $cur=(int)date('Y'); for($y=$cur;$y>=1905;$y--){ echo "<option value='$y'>$y</option>"; } ?>
                    </select>
                </div>
            </div>

            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded py-2 mt-2">Sign up</button>
        </form>
    </div>

    <script>
        const successMsg = document.querySelector('.success');
        if (successMsg) { setTimeout(() => successMsg.style.display = 'none', 2000); }

        function isValidDate(y, m, d) {
            const dt = new Date(y, m - 1, d);
            return dt.getFullYear() === y && (dt.getMonth() + 1) === m && dt.getDate() === d;
        }
        

        function validateForm() {
            const email = document.getElementById('email').value.trim();
            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('username').value.trim();
            const pass = document.getElementById('password').value;
            const day = parseInt(document.getElementById('dob_day').value);
            const month = parseInt(document.getElementById('dob_month').value);
            const year = parseInt(document.getElementById('dob_year').value);

            const emailPattern = /^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/;
            const namePattern = /^[a-zA-Z]+$/;
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

            if (!emailPattern.test(email)) { alert('Please enter a valid email address'); return false; }
            if (!namePattern.test(fullName)) { alert('Full name can only contain alphabets [A-Z]'); return false; }
            if (username.length === 0) { alert('Username is required'); return false; }
            if (!passwordPattern.test(pass)) { alert('Password must have at least one special character, a number and be at least 8 chars'); return false; }
            if (!day || !month || !year || !isValidDate(year, month, day)) { alert('Please select a valid birthday'); return false; }
        
            return true;
        }
    </script>
</body>
</html>