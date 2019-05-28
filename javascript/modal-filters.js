/*
CodedInk
BWP-Portal/javascript/dashboard-scripts.js
Script for dashboard
 */

const table = document.getElementById('data-table');
const tableRow = table.getElementsByTagName('tr');
let filteredMeds = [];
let filteredSymptoms = [];
let filteredPDQ = [];
let filteredAssessment = [];

//pdq assoc array
let pdqCategoryMap = {
     "mobility" : 0,
     "dailyLiving" : 1,
     "emotional" : 2,
     "stigma" : 3,
     "social" : 4,
     "cognition" : 5,
     "communication" : 6,
     "body" : 7
};

//physical assessment map
let paMap = {
    "fab" : 0,
    "tug" : 1,
    "s2s" : 2
};


//FILTER THE CHECKBOX MODALS FOR MEDICATION
//on submit, check what boxes are checked
$('#medicationForm, #symptomsForm, #PDQForm, #physicalForm').on('submit', function (e) {
    e.preventDefault();

    let checkedMedications = [];
    let checkedSymptoms = [];
    let checkedPDQ = [];
    let checkedAssessment = [];
    let pdqLabels = [];
    let paLabels = [];

    //push any checked meds into the meds array
    $(".medCheck:checked").each(function () {
        checkedMedications.push($(this).val().toLowerCase());
    });

    //push any checked symptoms into the symptoms array
    $(".symCheck:checked").each(function () {
        checkedSymptoms.push($(this).val().toLowerCase());
    });

    //push any selected pdq into pdq array
    $(".pdqCheck option:selected").each(function () {

        if ($(this).val().toLowerCase() !== 'none') {
            pdqLabels.push(pdqCategoryMap[this.classList[0]]);
            checkedPDQ.push($(this).val().toLowerCase());
        }

    });

    //push any selected pdq into pdq array
    $(".physicalCheck option:selected").each(function () {

        if ($(this).val().toLowerCase() !== 'none') {
            paLabels.push((paMap[this.classList[0]]));
            checkedAssessment.push($(this).val().toLowerCase());
        }

    });

    //filter medications
    if (checkedMedications !== null && checkedMedications.length !== 0) {
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
    if (checkedSymptoms !== null && checkedSymptoms.length !== 0) {
        for (let i = 0; i < tableRow.length; i++) {
            filteredSymptoms.push(tableRow[i]);
        }
        $(checkedSymptoms).each(function () {
            filteredSymptoms = filteredSymptoms.filter(row => {
                return row.innerText.toLowerCase().includes(this);
            });
        });
    }

    if (checkedPDQ !== null && checkedPDQ.length !== 0) {

        for (let i = 1; i < tableRow.length; i++) {
            filteredPDQ.push(tableRow[i]);
        }

        for (let i = 0; i < checkedPDQ.length; i++) {

            filteredPDQ = filteredPDQ.filter(row => {
                return filterPDQRow(pdqLabels[i], row, checkedPDQ[i]);
            });
        }
    }

    //filter assessment
    if (checkedAssessment !== null && checkedAssessment.length !== 0) {

        for (let i = 1; i < tableRow.length; i++) {
            filteredAssessment.push(tableRow[i]);
        }

        for (let i = 0; i < checkedAssessment.length; i++) {

            filteredAssessment = filteredAssessment.filter(row => {
                return filterPhysicalAssessment(paLabels[i], row, checkedAssessment[i]);
            });
        }
    }

    if (checkedMedications.length === 0 && checkedSymptoms.length === 0 && checkedPDQ.length === 0 && checkedAssessment.length === 0) {
        filterTable(null, null, null, null);
    }
    else {
        //filter the table
        filterTable(filteredMeds, filteredSymptoms, filteredPDQ, filteredAssessment);
    }


    //hide the modal
    $('#medicationModal, #symptomsModal, #PDQModal').modal('hide');

});

/**
 * Filters a row based on PDQ
 * @param index the category being filtered by
 * @param row the row being filtered
 * @param filterKey "low" "medium" or "high" based on user selection
 * @returns {boolean} true if the row matches filters - otherwise false
 */
function filterPDQRow(index, row, filterKey) {
    if (row.children[3].innerText === "N/A") {
        return false;
    }

    //split row into an array
    let categoryList = row.children[3].innerText.split(", ");

    //get the score
    let categoryScore = parseInt(categoryList[index].substring(categoryList[index].length - 3));

    //check if score is within given range
    if (filterKey === "low") {
        if (categoryScore <= 33) {
            return true;
        }
    }
    else if (filterKey === "medium") {
        if (categoryScore > 33 && categoryScore <= 66) {
            return true
        }
    }
    else if (filterKey === "high") {
        if (categoryScore > 66) {
            return true;
        }
    }

    return false;
}

function filterPhysicalAssessment(index, row, filterKey)
{
    if (row.children[4].innerText === "N/A") {
        return false;
    }

    //split row into an array
    let categoryList = row.children[4].innerText.split(", ");

    //get the score
    let categoryAssessment = parseInt(categoryList[index].substring(categoryList[index].length - 3));
    let assessmentType = categoryList[index].replace(/[0-9: -]/g, '');


    //check if score is within given range
    if (filterKey === "low") {
        if(assessmentType === "FAB" || assessmentType === "SittoStandScore")
        {
            if (categoryAssessment <= 33) {
                return true;
            }
        }
        else if(assessmentType === "UpScore")
        {
            if(categoryAssessment <= 0)
            {
                return true;
            }
        }
    }
    else if (filterKey === "medium") {
        if(assessmentType === "FAB" || assessmentType === "SittoStandScore")
        {
            if (categoryAssessment > 33 && categoryAssessment <= 66) {
                return true
            }
        }
        else if(assessmentType === "UpScore")
        {
            if(categoryAssessment > 0 && categoryAssessment < 100)
            {
                return true;
            }
        }
    }
    else if (filterKey === "high") {
        if(assessmentType === "FAB" || assessmentType === "SittoStandScore")
        {
            if (categoryAssessment > 66) {
                return true;
            }
        }
        else if(assessmentType === "UpScore")
        {
            if(categoryAssessment > 99)
            {
                return true;
            }
        }
    }

    return false;
}


/**
 * Filter the table based on all selected filters
 * @param medications array of selected medications
 * @param symptoms array of selected symptoms
 * @param pdq array of selected pdq
 * @param assessment array of selected physical assessment
 */
function filterTable(medications, symptoms, pdq, assessment) {

    //display all rows before filtering
    for (let i = 0; i < tableRow.length; i++) {
        tableRow[i].style.display = "";
    }

    //hide all rows if filtering by something that doesn't exist
    if (medications !== null && symptoms !== null && pdq !== null && assessment !== null) {

        if (medications.length === 0 && symptoms.length === 0 && pdq.length === 0 && assessment.length === 0) {
            for (let i = 1; i < tableRow.length; i++) {
                tableRow[i].style.display = "none";
            }
        }
        else {
            //first hide any that don't have the right med
            if (medications.length !== 0) {
                for (let i = 1; i < tableRow.length; i++) {
                    if (!medications.includes(tableRow[i])) {
                        tableRow[i].style.display = "none";
                    }
                }
            }

            //hide any that don't have the symptoms
            if (symptoms.length !== 0) {
                for (let i = 1; i < tableRow.length; i++) {
                    if (!symptoms.includes(tableRow[i])) {
                        tableRow[i].style.display = "none";
                    }
                }
            }

            //hide any that don't match the pdq
            if (pdq.length !== 0) {
                for (let i = 1; i < tableRow.length; i++) {
                    if (!pdq.includes(tableRow[i])) {
                        tableRow[i].style.display = "none";
                    }
                }
            }

            //hide any that don't match assessment
            if (assessment.length !== 0) {
                for (let i = 1; i < tableRow.length; i++) {
                    if (!assessment.includes(tableRow[i])) {
                        tableRow[i].style.display = "none";
                    }
                }
            }
        }
    }
}

/**
 * Displays data for specific row in a modal
 * @param row the row to display the data for
 */
function getUserData(row) {
    let medication = row.cells[1].innerHTML;
    let symptoms = row.cells[2].innerHTML;
    let pdq = row.cells[3].innerHTML;
    let assessment = row.cells[4].innerHTML;
    $('#modal-content').html("<b>Medication:</b> " + medication + "<br><b>Symptoms: </b>" + symptoms + "<br><b>PDQ:</b> "
        + pdq + "<b>Phyical Assessment:</b>" + assessment);
}

/**
 * Searches the table for the given input
 */
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

/**
 * Resets table to its original status and clears all filter selections
 */
function clearFilters() {
    filteredMeds = [];
    filteredSymptoms = [];
    filteredPDQ = [];
    filteredAssessment = [];

    //clear checkboxes
    $(".medCheck").each(function () {
        $(".medCheck").prop("checked", false);
    });

    $(".symCheck:checked").each(function () {
        $(".symCheck").prop("checked", false);
    });

    $(".pdqCheck option:selected").each(function () {
        $(this).prop("selected", false);
    });

    $(".physicalCheck option:selected").each(function () {
        $(this).prop("selected", false);
    });

    //show all rows
    for (let i = 0; i < tableRow.length; i++) {
        tableRow[i].style.display = "";
    }
}


