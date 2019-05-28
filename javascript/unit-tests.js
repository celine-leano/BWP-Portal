/*
CodedInk
BWP-Portal/javascript/unit-tests.js
Unit testing
 */

/**
 * Checks that the table is not displaying patients that do not
 * have data for medication, symptoms, pdq, and physical assessment.
 */
function testPatientsNoData(result) {
    let table = document.getElementById("data-table");
    let tr = table.getElementsByTagName("tr");
    const numDataColumns = 4;
    let testPassed = true;

    //loop through table rows, looking for rows with N/A for each td
    //intentionally skips the first tr (because of headers)
    let noInfoCount;

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        noInfoCount = 0;
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML == "N/A") {
                //increments variable that holds the number of tds with no data
                noInfoCount++;
            }
        }
        //if all data in the row is "N/A", test fails
        if (noInfoCount == numDataColumns) {
            testPassed = false;
        }
    }

    if (testPassed) {
        console.log("Test Passed: Patients with no data for medication, symptoms, pdq, " +
            "and physical assessment is not being displayed on the live table.");
    } else {
        console.log("Test Failed: Patients with no data for medication, symptoms, pdq, " +
            "and physical assessment should not be displayed on the live table.");
    }

}