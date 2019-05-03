/*
CodedInk
BWP-Portal/javascript/dashboard-scripts.js
Script for dashboard
 */
function myFunction() {
    // Declare variables
    let input, filter, table, tr, td, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("data-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    // Loop through all table rows
    for (i = 1; i < tr.length; i++) {
        // Loop through all table columns in the current row, and hide those who don't match the search query
        let found = false;
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
const table = document.getElementById('data-table');
const tableRow = table.getElementsByTagName('tr');

$('#medicationForm, #symptomsForm').on('submit', function (e) {
    e.preventDefault();

    let checkedMedications = [];
    let checkedSymptoms = [];
    let filteredMeds = [];
    let filteredSymptoms = [];

    //push any checked meds into the meds array
    $(".medCheck:checked").each(function () {
        checkedMedications.push($(this).val().toLowerCase());
    });

    //push any checked symptoms into the symptoms array
    $(".symCheck:checked").each(function () {
        checkedSymptoms.push($(this).val().toLowerCase());
    });

    //filter medications
    if(checkedMedications.length !== 0)
    {
        for (let i = 0; i < tableRow.length; i++) {
            filteredMeds.push(tableRow[i]);
        }
        $(checkedMedications).each(function () {
            filteredMeds = filteredMeds.filter(row => {
                return row.children[1].innerText.toLowerCase().includes(this);
            });
        });
    }


    //filter symptoms
    if(checkedSymptoms.length !== 0)
    {
        for (let i = 0; i < tableRow.length; i++) {
        filteredSymptoms.push(tableRow[i]);
    }
        $(checkedSymptoms).each(function () {
            filteredSymptoms = filteredSymptoms.filter(row => {
                return row.innerText.toLowerCase().includes(this);
            });
        });
    }

    //filter the table
    filterTable(filteredMeds, filteredSymptoms);

    //hide the modal
    $('#medicationModal, #symptomsModal').modal('hide');

});

function filterTable(medications, symptoms) {

    //display all rows before filtering
    for (let i = 0; i < tableRow.length; i++) {
        tableRow[i].style.display = "";
    }

    //first hide any that don't have the right med
    if(medications.length !== 0)
    {
        for (let i = 1; i < tableRow.length; i++) {
            if(!medications.includes(tableRow[i])) {
                tableRow[i].style.display = "none";
            }
        }
    }

    //hide any that don't have the symptoms
    if(symptoms.length !== 0)
    {
        for (let i = 1; i < tableRow.length; i++) {
            if(!symptoms.includes(tableRow[i])) {
                tableRow[i].style.display = "none";
            }
        }
    }
}

function getUserData(row) {
    let medication = row.cells[1].innerHTML;
    let symptoms = row.cells[2].innerHTML;
    $('#modal-content').html("<b>Medication:</b> " + medication + "<br><b>Symptoms: </b>" + symptoms);
}
