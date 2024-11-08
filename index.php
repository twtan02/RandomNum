<?php
include('config.php');
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Random Number Matching</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <h2>Enter a 5-digit number:</h2>
    <input type="text" id="inputNumber" maxlength="5" />
    <button id="startCollection">Start Collection</button>
    <div id="runningNumber"></div>
    <div id="results"></div>

    <script src="script.js"></script>
</body>

</html>