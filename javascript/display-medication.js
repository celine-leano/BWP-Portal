// Access and load the HTML document
$(document).ready(function() {

    // API request setup
    let settings = {
        "url": "https://bwp-app.herokuapp.com/api/research/",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZDFhZDVlOWE1ZmY3MDAxNjg3ZTZkNSIsIm5hbWUiOiJjb2RlZEluayIsInVzZXJuYW1lIjoiY29kZWRJbmsiLCJpYXQiOjE1NTc2OTI4OTAsImV4cCI6MTU1Nzc3OTI5MH0.xFzKl2FkV14DAZ6uxiQgp3sLicKE8en20ebGLZYOd50"
        },
    };

    $.ajax(settings).done(function (patient) {

        getMeds(patient);
    });
});

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
}
