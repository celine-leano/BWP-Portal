/*
CodedInk
BWP-Portal/javascript/dashboard-scripts.js
Script for dashboard
 */

function printTable()
{
    $(document).ready(function() {

        let medResults;
        let symptomResults;
        let pdqResults;

        $.ajax({
            url: 'https://bwp-app.herokuapp.com/api/research/',
            type: 'GET',
            dataType: 'json',
            success: function (result){
                medResults = getMeds(result);
                symptomResults = getSymptoms(result);
                pdqResults = getPDQ(result);

                for (let i = 0; i < medResults.length; i++) {
                    $('#data-table').append(
                        '<tr onclick=\'getUserData(this)\' data-toggle=\'modal\' data-target=\'#userDataModal\'>' +
                        '<td>' + (i+1) + '</td>' +
                        '<td>' + medResults[i] + '</td>' +
                        '<td>' + symptomResults[i].toString().replace(/,/g, "\n") + '</td>' +
                        '<td>' + formatPDQ(pdqResults[i]) + '</td>' +
                        '</tr>'
                    );
                }

        },
        beforeSend: setHeader
        });



    });
}

function setHeader(header)
{
    header.setRequestHeader('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZDFhZDVlOWE1ZmY3MDAxNjg3ZTZkNSIsIm5hbWUiOiJjb2RlZEluayIsInVzZXJuYW1lIjoiY29kZWRJbmsiLCJpYXQiOjE1NTc4NTAzMDUsImV4cCI6MTU1NzkzNjcwNX0.oXHOMXidHqnClKIrCo6xBzSMmFrXQuSjH8miZeUJ_RA')
}

function getMeds(patient) {

    let medsArray = [];
    for (let i = 0; i < patient.length; i++) {

        let medications = patient[i].parkinsonsMedications;
        let patientMed = "";
        // Prints the medications that the patient takes
        for (med in medications) {

            if (medications[med] == true) {

                patientMed += med + " ";
            }
        }

        if (patientMed == "") {

            patientMed = "N/A";
        }

        medsArray.push(patientMed);
    }

    return medsArray;
}

// display the symptoms of each patient
function getSymptoms(patient) {
    let allPatientSymptoms = [];

    for (let i = 0; i < patient.length; i++) {
        // array to store all symptoms that a patient has
        let symptoms = [];

        // check for tremor types
        let tremorTypes = patient[i].parkinsonSymptoms.tremors;
        for (let tremor in tremorTypes) {
            if (tremorTypes[tremor] == true) {
                $.getJSON('json/healthKeywords.json', function(keyword) {
                    // TODO: prints to console just fine, and adds to
                    // the array, but at the very end all keywords do not
                    // exist in the final array...
                    symptoms.push(keyword.tremors[tremor]);
                    console.log(keyword.tremors[tremor]);
                });
                symptoms.push(tremor);
            }
        }
        // check for postural changes
        let posturalChanges = patient[i].parkinsonSymptoms.posturalChanges;
        for (let changes in posturalChanges) {
            if (posturalChanges[changes] == true) {
                $.getJSON('json/healthKeywords.json', function(keyword) {
                    console.log(keyword.posturalChanges[changes]);
                });
                symptoms.push(changes);
            }
        }

        // check for misc symptoms
        let miscSymptoms = patient[i].parkinsonSymptoms;
        for (let misc in miscSymptoms) {
            if (miscSymptoms[misc] == true) {
                $.getJSON('json/healthKeywords.json', function(keyword) {
                    console.log(keyword[misc]);
                });
                symptoms.push(misc);
            }
        }

        // check for health problems
        let healthProblems = patient[i].healthAndHeart.health;
        for (let health in healthProblems) {
            if (healthProblems[health] == true) {
                $.getJSON('json/healthKeywords.json', function(keyword) {
                    console.log(keyword.health[health]);
                });
                symptoms.push(health);
            }
        }

        // check for heart problems
        let heartProblems = patient[i].healthAndHeart.heart;
        for (let heart in heartProblems) {
            if (heartProblems[heart] == true) {
                $.getJSON('json/healthKeywords.json', function(keyword) {
                    console.log(keyword.heart[heart]);
                });
                symptoms.push(heart);
            }
        }

        // check if array is empty
        if (symptoms.length == 0) {
            symptoms.push("N/A");
        }
        allPatientSymptoms.push(symptoms);
    }

    return allPatientSymptoms;
}

function getPDQ(result)
{
    let allPDQData = [];
    for (let i = 0; i < result.length; i++) {

        let PDQScore = (Object.keys(result[i].pdq));

        if(PDQScore.length == 0)
        {
            allPDQData.push("N/A");
            continue;
        }

        let currentPDQScore = (Object.keys(result[i].pdq)[PDQScore.length-1]);

        let scoreArray = result[i].pdq[currentPDQScore];

        let convertScores = pdqAssessmentScore(scoreArray);
        let finalScores = JSON.stringify(convertScores);

        allPDQData.push(finalScores);
    }

    return allPDQData;
}

function formatPDQ(pdq)
{
    let regex = /[{"}]/g;
    pdq = pdq.replace(regex, "");
    console.log(pdq);
    pdq = pdq.replace(/:/g, ": ");
    pdq = pdq.replace(/,/g, ", ");

    return pdq;
}

function pdqCategoryQuestionsAmount(category)
{
    switch(category){
        case "Mobility": return 10;
        case "DailyLiving": return 6;
        case "Emotional": return 6;
        case "Stigma": return 4;
        case "Social": return 3;
        case "Cognition": return 4;
        case "Communication": return 3;
        case "Body": return 3;
    }
}

/**
 * Given an array of PDQ39 question objects, this function grades the assessment into it's categories.
 * @param {array} assessmentArray - An array of assessment objects
 * @returns {object} scoredAssessment - An object containing the different categories of the PDQAssessment, graded.
 */
function pdqAssessmentScore(assessmentArray)
{
    const scoredAssessment = {
        Mobility: 0,
        DailyLiving: 0,
        Emotional: 0,
        Stigma: 0,
        Social: 0,
        Cognition: 0,
        Communication: 0,
        Body: 0
    };
    assessmentArray.forEach((value) => {
        scoredAssessment[value.category] += Number(value.answer);
    });

    Object.keys(scoredAssessment).forEach((value) => {
        scoredAssessment[value] = Math.ceil((scoredAssessment[value] / this.pdqCategoryQuestionsAmount(value)) * 100);
    });

    return scoredAssessment;
}

function healthKeywords() {
    var table = document.getElementById("data-table");


    // load JSON file containing health keywords
    $.getJSON("json/healthKeywords.json", function(result) {
        

        //iterate through rows, starting after the table headers
        /*for (var i = 1, row; row = table.rows[i]; i++) {
            //iterate through columns, starting at 'medication'
            for (var j = 1, col; col = row.cells[j]; j++) {
                //get data from cells and separate each keyword using a delimiter
                let data = row.cells[j];
                let keyword = data.split(", ");
                //go through each keyword and update the keyword so it does not display
                //in camelcase
                for (int i = 0; i < keyword.length; i++) {
                    $.each(result, function(keyword[i])) {
                        // ...?
                    }
                }
                //combine keyword array to become a single string and put it back into
                //its cell

                //done?

                //there must be an easier way.
            }
        } */
    });
}

