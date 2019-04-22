<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - BWP Portal</title>
    <link rel="stylesheet" type="text/css" href="dashboard-styles.css">
</head>
<body>
<input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names..">

<table id="myTable">
    <tr class="header">
        <th>Patient #</th>
        <th>Medication</th>
        <th>Symptoms</th>
    </tr>
    <?php
    // connect to db
    require '/home2/codedink/db.php';

    // get the student's information from db
    $sql = "SELECT * FROM MedicalData";

    // send query to database
    $result = @mysqli_query($cnxn, $sql);

    // display in table for admin
    while ($row = mysqli_fetch_assoc($result)) {
        $id = $row['patient_id'];
        $medication = $row['medication'];
        $symptoms = $row['symptoms'];

        echo "<tr><td>$id</td><td>$medication</td><td>$symptoms</td></tr>";
    }
    ?>
</table>
</body>
<script src="dashboard-scripts.js"></script>
</html>