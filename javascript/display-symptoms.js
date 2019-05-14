/*
CodedInk
BWP-Portal/javascript/display-symptoms.js
Displays fighter data using an API
 */

// get data using url and display the symptoms of each patient
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
}