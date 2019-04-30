/*
CodedInk
BWP-Portal/javascript/dashboard-scripts.js
Script for dashboard
 */
function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("data-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    // Loop through all table rows
    for (i = 1; i < tr.length; i++) {
        // Loop through all table columns in the current row, and hide those who don't match the search query
        var found = false;
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                //if found at least once it is set to true
                found = true;
            }
        }
        //only hides or shows it after checking all columns
        if (found) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

//FILTER THE CHECKBOX MODALS FOR MEDICATION
//on submit, check what boxes are checked
var table = document.getElementById("data-table");
$('#medicationForm').on('submit', function (e) {
    let tableRow = table.getElementsByTagName("tr");
    var medication = [];
    e.preventDefault();
    //put the check boxes in array to loop through
    $(".medCheck:checked").each(function () {
        medication.push($(this).val());
    });
    if (medication.length === 0) {
        for (let i = 1; i < tableRow.length; i++) {
            tableRow[i].style.display = "";
        }
    }
    for (i = 0; i < medication.length; i++) {
        let filter = medication[i].toUpperCase();
        for (let j = 1; j < tableRow.length; j++) {
            let tableData = tableRow[j].getElementsByTagName("td");
            if (!tableData[1].innerHTML.toUpperCase().includes(filter)) {
                tableRow[j].style.display = "none";
            }
        }
    }

    $('#medicationModal').modal('toggle');
});

// FILTER THE CHECKBOX MODAL FOR SYMPTOMS
$('#symptomsForm').on('submit', function (e) {
    let tableRow = table.getElementsByTagName("tr");
    var symptoms = [];
    e.preventDefault();
    //put the check boxes in array to loop through
    $(".symCheck:checked").each(function () {
        symptoms.push($(this).val());
    });
    if (symptoms.length === 0) {
        for (let i = 1; i < tableRow.length; i++) {
            tableRow[i].style.display = "";
        }
    }
    for (i = 0; i < symptoms.length; i++) {
        let filterSymptoms = symptoms[i].toUpperCase();
        for (let j = 1; j < tableRow.length; j++) {
            let tableData = tableRow[j].getElementsByTagName("td");
            if (!tableData[2].innerHTML.toUpperCase().includes(filterSymptoms)) {
                tableRow[j].style.display = "none";
            }
        }
    }
    $('#symptomsModal').modal('toggle');
});

