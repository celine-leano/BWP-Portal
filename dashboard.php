<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - BWP Portal</title>
    <!-- link rel="stylesheet" type="text/css" href="dashboard-styles.css"> -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
            crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
            integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
            crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"></script>
</head>
<body>
<div class="container">

    <div class="row mb-2 mt-2">
        <div class="col-8 input-group input-group-md">
            <div class="input-group-prepend">
                <span class="input-group-text">Search</span>
            </div>
            <input type="text" class="form-control" id="search" onkeyup="myFunction()">
        </div>
        <div class="col-1">
            <button class="btn btn-md btn-primary">Medication</button>
        </div>
        <div class="col-1">
            <button class="btn btn-md btn-primary">Symptoms</button>
        </div>
    </div>

    <div class="row col-12">
        <table class="table" id="data-table">
            <thead>
                <th>ID</th>
                <th>Medication</th>
                <th>Symptoms</th>
            </thead>
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
    </div>

</div>
</body>
<script src="javascript/dashboard-scripts.js"></script>
</html>