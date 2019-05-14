$(document).ready(function() {

    $.ajax({
        url: 'https://bwp-app.herokuapp.com/api/research/',
        type: 'GET',
        dataType: 'json',
        success: function (result)
            getPDQ(result);
        },
        beforeSend: setHeader
    });
});

function setHeader(header)
{
    header.setRequestHeader('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZDFhZDVlOWE1ZmY3MDAxNjg3ZTZkNSIsIm5hbWUiOiJjb2RlZEluayIsInVzZXJuYW1lIjoiY29kZWRJbmsiLCJpYXQiOjE1NTc2OTI4OTAsImV4cCI6MTU1Nzc3OTI5MH0.xFzKl2FkV14DAZ6uxiQgp3sLicKE8en20ebGLZYOd50')
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

    let tdPDQ = document.getElementsByClassName('tdPDQ');
    for (let i = 0; i < allPDQData.length; i++) {
        tdPDQ[i].innerHTML = allPDQData[i];
    }
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