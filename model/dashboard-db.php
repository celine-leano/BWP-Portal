<?php
///**
// * Queries the database to get the medical information and display it in the table
// *
// */
//
//// connect to db
//require '/home2/codedink/db.php';
//
//// get the medical data from the db
//$sql = "SELECT * FROM MedicalData";
//
//// send query to database
//$result = @mysqli_query($cnxn, $sql);
//
//// display in table
//while ($row = mysqli_fetch_assoc($result)) {
//    $id = $row['patient_id'];
//    $medication = $row['medication'];
//    $symptoms = $row['symptoms'];
//
//    echo "<tr onclick='getUserData(this)' data-toggle='modal' data-target='#userDataModal' ><td>$id</td><td>$medication</td><td>$symptoms</td><td class='tdPDQ'></td></tr>";
//}