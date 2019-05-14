/*
CodedInk
BWP-Portal/javascript/dashboard-scripts.js
Script for dashboard
 */

//FILTER THE CHECKBOX MODALS FOR MEDICATION
//on submit, check what boxes are checked
const table = document.getElementById('data-table');
const tableRow = table.getElementsByTagName('tr');
let filteredMeds = [];
let filteredSymptoms = [];
let filteredPDQ = [];

//pdq assoc array
let pdqCategoryMap = {
    0 : "mobility",
    1: "dailyLiving",
    2: "emotional",
    3: "stigma",
    4: "social",
    5: "cognition",
    6: "communitcation",
    7: "body"
};

$('#medicationForm, #symptomsForm, #PDQForm').on('submit', function (e) {
    e.preventDefault();

    let checkedMedications = [];
    let checkedSymptoms = [];
    let checkedPDQ = [];

    //push any checked meds into the meds array
    $(".medCheck:checked").each(function () {
        checkedMedications.push($(this).val().toLowerCase());
    });

    //push any checked symptoms into the symptoms array
    $(".symCheck:checked").each(function () {
        checkedSymptoms.push($(this).val().toLowerCase());
    });

    $(".pdqCheck option:selected").each(function() {
        checkedPDQ.push($(this).val().toLowerCase());
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

    //let scores = [];
    if (checkedPDQ.length !== 0) {

        for (let i = 1; i < tableRow.length; i++) {
            filteredPDQ.push(tableRow[i]);
        }

        for (let i = 0; i < checkedPDQ.length; i++) {
            if(checkedPDQ[i] != "none")
            {
                filteredPDQ = filteredPDQ.filter(row => {
                    return filterPDQRow(i, row, checkedPDQ[i]);
                });
            }
        }

    }

    //filter the table
    filterTable(filteredMeds, filteredSymptoms, filteredPDQ);

    //hide the modal
    $('#medicationModal, #symptomsModal, #PDQModal').modal('hide');

});

function filterPDQRow(index, row, filterKey)
{
    if(row.children[3].innerText === "N/A")
    {
        return false;
    }

    //split row into an array
    let categoryList = row.children[3].innerText.split(", ");

    //get the score
    let categoryScore = parseInt(categoryList[index].substring(categoryList[index].length - 3));

    if(filterKey === "low")
    {
        if(categoryScore <= 33)
        {
            return true;
        }
    }
    else if(filterKey === "medium")
    {
        if(categoryScore > 33 && categoryScore <= 66)
        {
            return true
        }
    }
    else if(filterKey === "high")
    {
        if(categoryScore > 66)
        {
            return true;
        }
    }

    return false;
}

function filterTable(medications, symptoms, pdq) {

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

    //hide any that don't match the pdq
    if(pdq.length !== 0)
    {
        for (let i = 1; i < tableRow.length; i++) {
            if(!pdq.includes(tableRow[i])) {
                tableRow[i].style.display = "none";
            }
        }
    }

}

function getUserData(row) {
    let medication = row.cells[1].innerHTML;
    let symptoms = row.cells[2].innerHTML;
    let pdq = row.cells[3].innerHTML;
    $('#modal-content').html("<b>Medication:</b> " + medication + "<br><b>Symptoms: </b>" + symptoms + "<br><b>PDQ:</b> "
    + pdq);
}

function search() {
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

function clearFilters()
{
    filteredMeds = [];
    filteredSymptoms = [];

    filterTable(filteredMeds,filteredSymptoms);

}


