<?php

$host = 'localhost:3306';
$db = 'form_data';
$user = 'root';
$dbPassword = '123456789';

$tableName = "facebook_users";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $success_message = '';
    $error_message = '';

    $firstName = htmlspecialchars($_POST['firstName'] ?? '');
    $lastName = htmlspecialchars($_POST['lastName'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $password = htmlspecialchars($_POST['password'] ?? '');
    $gender = htmlspecialchars($_POST['gender'] ?? '');
    $dob_day = intval($_POST['dob_day'] ?? 0);
    $dob_month = intval($_POST['dob_month'] ?? 0);
    $dob_year = intval($_POST['dob_year'] ?? 0);

    // Regex
    $emailPattern = '/^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/';
    $namePattern = '/^[a-zA-Z]+$/';
    $passowrdPattern = '/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/';

    // age >= 13
    if (!checkdate($dob_month, $dob_day, $dob_year)) {
        $error_message = "Invalid date of birth";
        die("Invalid date of birth");
    }
    $dob = DateTime::createFromFormat('Y-m-d', sprintf('%04d-%02d-%02d', $dob_year, $dob_month, $dob_day));
    
    
    if (!preg_match($emailPattern, $email)) {
        $error_message = "Email is invalid";
        die("Email is invalid");
    }
    if (!preg_match($namePattern, $firstName)) {
        $error_message = "First name should only have alphabets";
        die("First name should only have alphabets");
    }
    if (!preg_match($namePattern, $lastName)) {
        $error_message = "Last name should only have alphabets";
        die("Last name should only have alphabets");
    }
    if (!preg_match($passowrdPattern, $password)) {
        $error_message = "Password should have atleast 1 special character, number and length of 8.";
        die("Password should have atleast 1 special character, number and length of 8.");
    }
    if (!in_array($gender, ['Female','Male','Custom'])) {
        $error_message = "Invalid gender value";
        die("Invalid gender value");
    }

    
    $conn = new mysqli($host, $user, $dbPassword, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql_create_table = "CREATE TABLE IF NOT EXISTS `$tableName` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            dob DATE NOT NULL,
            gender VARCHAR(10) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
    $conn->query($sql_create_table);

    $sql_insert = "INSERT INTO $tableName (first_name, last_name, email, password, dob, gender) VALUES (?,?,?,?,?,?)";
    if ($stmt = $conn->prepare($sql_insert)) {
        $dob_sql = $dob->format('Y-m-d');
        $stmt->bind_param("ssssss", $firstName, $lastName, $email, $password, $dob_sql, $gender);
        if ($stmt->execute()) {
            $success_message = "Success! User $firstName $lastName registered and saved to the database.";
        }
        $stmt->close();
    }

    $success_message = "Success! We received your data. Email: $email";
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Facebook - Sign Up</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100 text-gray-900">
    <?php if (isset($success_message)) { echo "<div class='success fixed top-2 left-1/2 -translate-x-1/2 text-green-800 font-bold border border-green-200 px-4 py-3 rounded bg-green-100 mb-4'>" . $success_message . "</div>"; } ?>

    <div class="flex items-center justify-center min-h-screen p-4">
        <form action="" method="post" onsubmit="return validateForm()" class="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
            <h1 class="text-2xl font-semibold text-center">Create a new account</h1>
            <p class="text-center text-sm text-gray-600">It's quick and easy.</p>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="firstName" class="block text-sm text-gray-700">First name</label>
                    <input type="text" id="firstName" name="firstName" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="First name" />
                </div>
                <div>
                    <label for="lastName" class="block text-sm text-gray-700">Surname</label>
                    <input type="text" id="lastName" name="lastName" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Surname" />
                </div>
            </div>

            <div>
                <label for="email" class="block text-sm text-gray-700">Mobile number or email address</label>
                <input type="email" id="email" name="email" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="abc@gmail.com" />
            </div>

            <div>
                <label for="password" class="block text-sm text-gray-700">New password</label>
                <input type="password" id="password" name="password" class="mt-1 w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="********" />
            </div>

            <div>
                <label class="block text-sm text-gray-700">Date of birth</label>
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

            <div>
                <label class="block text-sm text-gray-700">Gender</label>
                <div class="mt-2 grid grid-cols-3 gap-2">
                    <label class="flex items-center justify-between gap-2 border rounded px-3 py-2">
                        <span>Female</span>
                        <input type="radio" name="gender" value="Female" />
                    </label>
                    <label class="flex items-center justify-between gap-2 border rounded px-3 py-2">
                        <span>Male</span>
                        <input type="radio" name="gender" value="Male" />
                    </label>
                    <label class="flex items-center justify-between gap-2 border rounded px-3 py-2">
                        <span>Custom</span>
                        <input type="radio" name="gender" value="Custom" />
                    </label>
                </div>
            </div>

            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded py-2 mt-2">Sign Up</button>
        </form>
    </div>

    <script>
        const successMsg = document.querySelector('.success');
        if (successMsg) {
            setTimeout(() => successMsg.style.display = 'none', 2000);
        }

        function isValidDate(y, m, d) {
            const dt = new Date(y, m - 1, d);
            return dt.getFullYear() === y && (dt.getMonth() + 1) === m && dt.getDate() === d;
        }
        

        function validateForm() {
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('password').value;
            const day = parseInt(document.getElementById('dob_day').value);
            const month = parseInt(document.getElementById('dob_month').value);
            const year = parseInt(document.getElementById('dob_year').value);
            const gender = document.querySelector('input[name="gender"]:checked');

            const emailPattern = /^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/;
            const namePattern = /^[a-zA-Z]+$/;
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

            if (!emailPattern.test(email)) { alert('Please enter a valid email address'); return false; }
            if (!namePattern.test(firstName) || !namePattern.test(lastName)) { alert('First name & last name can only contain alphabets [A-Z]'); return false; }
            if (!passwordPattern.test(pass)) { alert('Password must have at least one special character, a number and be at least 8 chars'); return false; }
            if (!day || !month || !year || !isValidDate(year, month, day)) { alert('Please select a valid date of birth'); return false; }
            if (!gender) { alert('Please select a gender'); return false; }
            return true;
        }
    </script>

</body>

</html>