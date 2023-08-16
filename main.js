let countSpan = document.querySelector(".quiz-info .count span");
let bulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rAnswers = 0;
let countDownInterval;

function getQuestion() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            // createBullets
            createBullets(questionsCount);
            // console.log(questionsObject)
            // Add Question Data 
            addQuestionData(questionsObject[currentIndex], questionsCount);

            countDown(5, questionsCount);



            
            submitButton.onclick = () => {
                let rightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer, questionsCount);
                


                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                addQuestionData(questionsObject[currentIndex], questionsCount);


                handleBullets();

                clearInterval(countDownInterval);
                countDown(5, questionsCount);
                
                showResult(questionsCount);
            };
        };
    };

    myRequest.open("GET", "html-questions.json", true);
    myRequest.send();
}
getQuestion();

function createBullets(num) {
    countSpan.innerHTML = num;
    // CREATE SPANS
    for (let i = 0; i < num; i++){
        // create span
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.className = "on"
        }
        // append bullets To main bullets Container
        bulletsContainer.appendChild(bullet)

    }
};





function addQuestionData(object, count) {
    if (currentIndex < count) {
        // // create H2 question title
       // let questionTitle = document.createElement("h2");
       // //  create question Text
       // // append text to heading
    
        let questionTitle = document.createElement("h2");
        questionTitle.className = "m-0";
        let questionText = document.createTextNode(object["Title"]);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle)
    
        // create the answeers 
        for (let i = 1; i <= 4; i++){
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer  bg-[#f8f8f8] p-4";
            let RadioInput = document.createElement("input");
            RadioInput.name = "question";
            RadioInput.type = "radio";
            RadioInput.id = `answer-${i}`;
            RadioInput.dataset.answer = object[`answer-${i}`];
            let label = document.createElement("label");
            label.htmlFor = `answer-${i}`;
            label.className="cursor-pointer font-bold text-[#777] relative text-md ml-3 -top-1"
            labelText = document.createTextNode(object[`answer-${i}`]);
            label.appendChild(labelText);
            mainDiv.appendChild(RadioInput);
            mainDiv.appendChild(label);
            answersArea.appendChild(mainDiv);
        }
    }
};


function checkAnswer(RightAnswer,count) {
    let answers = document.getElementsByName("question");
    let chosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            chosenAnswer = answers[i].dataset.answer;
        };
    };
    if (RightAnswer === chosenAnswer) {
        rAnswers++;
    }
}




function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        };  
    });
};








function showResult(count) {
    let showResult;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        document.querySelector(".bullets").remove();
        if (rAnswers>(count/2) && rAnswers < count) {
            showResult=`<span class="good font-bold text-[#0075ff] ">Good</span>,${rAnswers} From ${count} Is GOOD`
        } else if(rAnswers===count){
            showResult=`<span class="perfect font-bold text-[#0075ff]  ">Good</span>,All Answers Is GOOD`
        } else {
            showResult=`<span class="bad font-bold text-[#0075ff]  ">Bad</span>,${rAnswers} From ${count} Is GOOD`
        };
        resultsContainer.innerHTML = showResult;
        resultsContainer.backgroundColor = 'white';
    };
};








function countDown(duration ,count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000)
    }
}