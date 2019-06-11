/*
CodedInk
BWP-Portal/javascript/dashboard-scripts.js
Script for dashboard
 */

/**
 * Gets the data from the RSB API and displays it in the table
 */
function printTable() {
    $(document).ready(function () {

        let medications;
        let symptoms;
        let medResults;
        let symptomResults;
        let pdqResults;
        let physicalResults;

        let medRequest = $.ajax({

                url: 'https://bwp-app.herokuapp.com/api/research/',
                type: 'GET',
                dataType: 'json',
                success: function (result) {

                    medications = getMeds(result);
                },

                beforeSend: setHeader //set the access token before making the AJAX call
            });

        let symptomRequest = $.ajax({

                url: 'https://bwp-app.herokuapp.com/api/research/',
                type: 'GET',
                dataType: 'json',
                success: function (result) {

                    symptoms = getSymptoms(result);
                },

                beforeSend: setHeader //set the access token before making the AJAX call
            });

        let pdqRequest = $.ajax({

            url: 'https://bwp-app.herokuapp.com/api/research/',
            type: 'GET',
            dataType: 'json',
            success: function (result) {

                pdqResults = getPDQ(result);
            },

            beforeSend: setHeader //set the access token before making the AJAX call
        });

        let physicalRequest = $.ajax({

            url: 'https://bwp-app.herokuapp.com/api/research/',
            type: 'GET',
            dataType: 'json',
            success: function (result) {

                physicalResults = getPA(result);
            },

            beforeSend: setHeader //set the access token before making the AJAX call
        });

        $.when(medRequest, symptomRequest, pdqRequest, physicalRequest).then(function() {

            $.ajax({
                url: 'json/healthKeywords.json',
                type: 'GET',
                dataType: 'json',
                success: function (result) {

                    medResults = printMeds(result, medications);
                    symptomResults = printSymptoms(result, symptoms);

                    //don't display the row if it has no data
                    for (let i = 0; i < medResults.length; i++) {
                        if (medResults[i] == "N/A" && symptomResults[i] == "N/A"
                            && formatPDQ((pdqResults[i])) == "N/A" && physicalResults[i] == "N/A") {
                            continue;
                        }

                        //display data
                        $('#data-table').append(
                            '<tr onclick=\'getUserData(this)\' data-toggle=\'modal\' data-target=\'#userDataModal\'>' +
                            '<td>' + (i + 1) + '</td>' +
                            '<td>' + medResults[i] + '</td>' +
                            '<td>' + symptomResults[i] + '</td>' +
                            '<td>' + formatPDQ(pdqResults[i]) + '</td>' +
                            '<td>' + physicalResults[i] + '</td>' +
                            '</tr>'
                        );

                    }

                }
            });
        });

    });
}

/**
 * Sets the access token to be able to access the API
 * @param header header for the API call
 */
function setHeader(header) {
    //retrieve token from local storage
    let token = window.localStorage.getItem("token");
    header.setRequestHeader('x-access-token', token);
}

/**
 * Gets the medications for each patient
 * @param patient the table row representing a patient
 * @returns {Array} of strings listing each patients medication
 */
function getMeds(patient) {
    let medsArray = [];
    for (let i = 0; i < patient.length; i++) {

        let medications = patient[i].parkinsonsMedications;
        let patientMed = "";
        // Prints the medications that the patient takes
        for (med in medications) {

            if (medications[med] == true) {

                patientMed += med + ", <br>";
            }
        }

        if (patientMed == "") {

            patientMed = "N/A";
        }

        medsArray.push(patientMed);
    }

    return medsArray;
}

// load JSON file containing health keywords
function printMeds(result, medsArray) {

    let newArray = [];

    for (let i = 0; i < medsArray.length; i++) {

        // Creates an array of medications for each patient
        let patientMeds = medsArray[i].split(", <br>");
        let medsString = "";

        if (patientMeds[0] == "N/A") {

            // Print an empty string if the patient has no
            // recorded medications
            medsString += "N/A";

        } else {

            for (let j = 0; j < patientMeds.length - 1; j++) {

                // Compare each medication name to each key in the
                // health keywords JSON file
                $.each(result, function (index, value) {

                    // If keywords match, print the formatted version of
                    // that medication from the JSON file
                    if (patientMeds[j] == index) {

                        if (j == (patientMeds.length - 2)) {

                            medsString += value;

                        } else {

                            medsString += value + ", <br>";
                        }
                    }
                });
            }
        }

        newArray.push(medsString);
    }

    return newArray;
}

/**
 * Gets the symptoms for each patient
 * @param patient table row representing a patient
 * @returns {Array} of each patients symptoms
 */
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

                symptoms.push(tremor);
            }
        }
        // check for postural changes
        let posturalChanges = patient[i].parkinsonSymptoms.posturalChanges;
        for (let changes in posturalChanges) {

            if (posturalChanges[changes] == true) {

                symptoms.push(changes);
            }
        }

        // check for misc symptoms
        let miscSymptoms = patient[i].parkinsonSymptoms;
        for (let misc in miscSymptoms) {

            if (miscSymptoms[misc] == true) {

                symptoms.push(misc);
            }
        }

        // check for health problems
        let healthProblems = patient[i].healthAndHeart.health;
        for (let health in healthProblems) {

            if (healthProblems[health] == true) {

                symptoms.push(health);
            }
        }

        // check for heart problems
        let heartProblems = patient[i].healthAndHeart.heart;
        for (let heart in heartProblems) {

            if (heartProblems[heart] == true) {

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

function printSymptoms(result, symptomsArray) {

    let newSymptoms= [];

    for (let i = 0; i < symptomsArray.length; i++) {

        let patientSymptoms = symptomsArray[i];
        let symptomString = "";

        // Print an empty string if the patient has no
        // recorded symptoms
        if (patientSymptoms[0] == "N/A") {

            symptomString += "N/A";

        } else {

            for (let j = 0; j < patientSymptoms.length; j++) {

                // Compare each medication name to each key in the
                // health keywords JSON file
                $.each(result, function (index, value) {

                    // If a key in the JSON file is nested, compare the keys within it
                    if ((Object.getPrototypeOf(result[index]) == Object.getPrototypeOf(result))) {

                        // If keywords match, print the formatted version of
                        // that symptom from the JSON file
                        $.each(result[index], function (newIndex, newValue) {

                            if (patientSymptoms[j] == newIndex) {

                                if (j == (patientSymptoms.length - 1)) {

                                    symptomString += newValue + "<br>";

                                } else {

                                    symptomString += newValue + ", <br>";
                                }
                            }
                        });

                        // Compare each symptom name to each key in the
                        // health keywords JSON file
                    } else if (patientSymptoms[j] == index) {

                        // If keywords match, print the formatted version of
                        // that symptom from the JSON file
                        if (j == (patientSymptoms.length - 1)) {

                            symptomString += value;

                        } else {

                            symptomString += value + ", <br>";
                        }
                    }
                });
            }
        }

        newSymptoms.push(symptomString);
    }

    return newSymptoms;
}

/**
 * Gets the PDQ scores for each patient
 * @param patient table row representing a patient
 * @returns {Array} of each patients PDQ scores
 */
function getPDQ(patient) {
    let allPDQData = [];
    for (let i = 0; i < patient.length; i++) {

        //gets all pdq object for all dates
        let PDQScore = (Object.keys(patient[i].pdq));

        //if the patient has no scores push 'N/A'
        if (PDQScore.length === 0) {
            allPDQData.push("N/A");
            continue;
        }

        //get the last date (most current)
        let currentPDQScore = (Object.keys(patient[i].pdq)[PDQScore.length - 1]);
        let scoreArray = patient[i].pdq[currentPDQScore];

        //convert the scores
        let convertScores = pdqAssessmentScore(scoreArray);
        let finalScores = JSON.stringify(convertScores);

        allPDQData.push(finalScores);
    }

    return allPDQData;
}

/**
 * Formats pdq scores into a more readable format
 * @param pdq the pdq score to be converted
 * @returns a formatted pdq string
 */
function formatPDQ(pdq) {
    let regex = /[{"}]/g;
    pdq = pdq.replace(regex, "");
    pdq = pdq.replace(/:/g, ": ");
    pdq = pdq.replace(/,/g, ",<br>");

    return pdq;
}

/**
 * Checks how many questions in the category
 * @param category the category of PDQ score
 * @returns {number} how many questions in category
 */
function pdqCategoryQuestionsAmount(category) {
    switch (category) {
        case "Mobility":
            return 10;
        case "DailyLiving":
            return 6;
        case "Emotional":
            return 6;
        case "Stigma":
            return 4;
        case "Social":
            return 3;
        case "Cognition":
            return 4;
        case "Communication":
            return 3;
        case "Body":
            return 3;
    }
}

/**
 * Given an array of PDQ39 question objects, this function grades the assessment into it's categories.
 * @param {array} assessmentArray - An array of assessment objects
 * @returns {object} scoredAssessment - An object containing the different categories of the PDQAssessment, graded.
 */
function pdqAssessmentScore(assessmentArray) {
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

/**
 * Gets the physical assessment data for each patient
 * @param patient table row representing a patient
 * @returns {Array} of each patients physical assessment scores
 */
function getPA(patient) {
    let physicalAssessmentArray = [];
    for (let i = 0; i < patient.length; i++) {
        let age = patient[i].personalInformation.birthDate;
        let gender = patient[i].personalInformation.gender;
        age = calculateAge(age);
        let allAssessments = (Object.keys(patient[i].physicalAssessments));

        //push 'N/A' if there are no scores
        if (allAssessments.length === 0) {
            physicalAssessmentArray.push("N/A");
            continue;
        }

        //get most recent score
        let currentPAScore = patient[i].physicalAssessments[allAssessments[0]];

        //format the score
        let formattedScore = paAssessmentScore(currentPAScore, gender, age);
        let fab = formattedScore.Score;
        let upScore = formattedScore.UpScore;
        let sitStandScore = formattedScore.S2SScore;

        physicalAssessmentArray.push("Fullerton Advanced Balance: " + fab + ",<br>" + "Timed Up And Go: " + upScore + ",<br>" + "Sit to Stand Score: " + sitStandScore);

    }
    return physicalAssessmentArray;
}

/**
 * Score a PA assessment
 * @param {Array} assessment - an array of PA assessment objects
 * @param {string} gender - fighters gender
 * @param {number} age - fighters age
 * @returns {{"Bal 2 Ft": number, Steps: string, Bench: number, "Sit to Stand": number, Pencil: number, "Heel Toe": number, "Head Turns": number, "360": number, "Up and Go": number, Foam: number, Inches: number, "Fall Back": number, "1 Leg": number, "2 Ft Jump": number}}
 */
function paAssessmentScore(assessment, gender, age) {
    const scoredAssessment = {
        "Bal 2 Ft": 0,
        "Pencil": 0,
        "360": 0,
        Steps: "",
        Bench: 0,
        "Heel Toe": 0,
        "1 Leg": 0,
        Foam: 0,
        "2 Ft Jump": 0,
        Inches: 0,
        "Head Turns": 0,
        "Fall Back": 0,
        "Sit to Stand": 0,
        "Up and Go": 0
    };

    assessment.forEach((value) => {
        scoredAssessment[value.assessmentName] = value.assessmentScore;
        if (value.assessmentName === "360") {
            scoredAssessment.Steps = `R${value.assessmentData[1].dataValue} L${value.assessmentData[0].dataValue}`;
        }

        if (value.assessmentName === "2 Ft Jump") {
            scoredAssessment.Inches = value.assessmentData[0].dataValue;
        }
    });

    scoredAssessment.Score = Math.ceil((Number(scoredAssessment["Bal 2 Ft"] + scoredAssessment["Pencil"] +
        scoredAssessment["360"] + scoredAssessment["Bench"] + scoredAssessment["Heel Toe"] + scoredAssessment["1 Leg"] +
        scoredAssessment["Foam"] + scoredAssessment["2 Ft Jump"] + scoredAssessment["Head Turns"] + scoredAssessment["Fall Back"])
        / 40) * 100);

    scoredAssessment.Target = 0;

    if (gender === "Female") {
        if (age < 64) scoredAssessment.Target = 12;
        else if (age > 64 && age <= 69) scoredAssessment.Target = 11;
        else if (age > 69 && age <= 79) scoredAssessment.Target = 10;
        else if (age > 79 && age <= 84) scoredAssessment.Target = 9;
        else if (age > 84 && age <= 89) scoredAssessment.Target = 8;
        else scoredAssessment.Target = 4;
    } else if (gender === "Male") {
        if (age < 64) scoredAssessment.Target = 14;
        else if (age > 64 && age <= 74) scoredAssessment.Target = 12;
        else if (age > 74 && age <= 79) scoredAssessment.Target = 11;
        else if (age > 79 && age <= 84) scoredAssessment.Target = 10;
        else if (age > 84 && age <= 89) scoredAssessment.Target = 8;
        else scoredAssessment.Target = 7;
    }

    scoredAssessment.S2SScore = Number(scoredAssessment["Sit to Stand"]) > 0 ? Math.ceil((Number(scoredAssessment["Sit to Stand"]) / Number(scoredAssessment.Target)) * 100) : 0;
    scoredAssessment.UpScore = Math.ceil((1 + (1 - (Number(scoredAssessment["Up and Go"]) / 8))) * 100);

    return scoredAssessment;
}

function calculateAge(dateString){
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}