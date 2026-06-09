const quizData=[
    {
        question: "Which keyword is used to declare a block-scoped variable that can be reassigned?",
        options: ["var","let","const","define"],
        correct: 1
    },
    {
        question: "What is the output of console.log(typeof []);",
        options: ["array","object","null","undefined"],
        correct: 1
    },
    {
        question: "Which operator is used for strict equality, checking both value and data type?",
        options: ["=","==","===","!="],
        correct: 2
    },
    {
        question: "What is the correct way to write a single-line comment?",
        options: ["<!--comment-->","/*comment*/","//comment","#comment"],
        correct: 2
    },
    {
        question: `What will be the output of the following code?\nlet fruits = ["Apple","Banana"];\nfruits[5]="Mango";\nconsole.log(fruits.length);`,
        options: ["3","5","6","undefined"],
        correct: 2
    },

];

let currentQuestionIndex = 0;
let scoreCount = 0;
let secondsRemaining = 15;
let counterIntervalToken = null;
let isVerifyingAnswer = false;

const welcomeScreenNode = document.getElementById('welcome-screen');
const quizScreenNode = document.getElementById('quiz-screen');
const resultsScreenNode = document.getElementById('results-screen');
const questionTextNode = document.getElementById('ques-text');
const optionsFormNode = document.getElementById('opt-form');
const startButtonNode = document.getElementById('start-btn');
const submitButtonNode = document.getElementById('submit-btn');
const timeDisplayNode = document.getElementById('time-display');
const progressIndicatorNode = document.getElementById('progress-ind');
const finalScoreNode = document.getElementById('final-score');
const totalQuestionsNode = document.getElementById('total-questions');
const feedbackTextNode = document.getElementById('performance-feedback');
const restartButtonNode = document.getElementById('restart-btn');

setupWelcome();

function setupWelcome(){
    welcomeScreenNode.classList.remove('hidden');
    quizScreenNode.classList.add('hidden');
    resultsScreenNode.classList.add('hidden');
    timeDisplayNode.parentElement.classList.add('hidden');
    progressIndicatorNode.style.width = "0%";
}

function initializeQuizSession(){
    currentQuestionIndex = 0;
    scoreCount = 0;
    welcomeScreenNode.classList.add('hidden');
    resultsScreenNode.classList.add('hidden');
    quizScreenNode.classList.remove('hidden');
    timeDisplayNode.parentElement.classList.remove('hidden');
    renderQuestionIndexStructure();
}

function renderQuestionIndexStructure(){
    clearInterval(counterIntervalToken);
    isVerifyingAnswer = false;
    submitButtonNode.disabled = true;
    submitButtonNode.textContent = "Submit Answer";
    optionsFormNode.innerHTML = "";
    secondsRemaining = 15;
    timeDisplayNode.textContent = secondsRemaining;

    const activeQuestionObj = quizData[currentQuestionIndex];
    questionTextNode.textContent = `${currentQuestionIndex + 1}. ${activeQuestionObj.question}` ;

    const trackingPercentage = ((currentQuestionIndex) / quizData.length) * 100;
    progressIndicatorNode.style.width = `${trackingPercentage}%` ;

    activeQuestionObj.options.forEach((optionString, indexValue) => {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('option-wrapper');
        wrapperDiv.setAttribute('data-index', indexValue);

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'quiz-selection';
        radioButton.id = 'option-${indexValue}';
        radioButton.value = indexValue;

        const labelText = document.createElement('label');
        labelText.htmlFor = `option-${indexValue}`;
        labelText.classList.add('option-text');
        labelText.textContent = optionString;

        wrapperDiv.addEventListener('click',() =>{
            if(isVerifyingAnswer) return;

            document.querySelectorAll('.option-wrapper').forEach(node => node.classList.remove('selected'));
            wrapperDiv.classList.add('selected');
            radioButton.checked = true;
            submitButtonNode.disabled = false;
        });

        wrapperDiv.appendChild(radioButton);
        wrapperDiv.appendChild(labelText);
        optionsFormNode.appendChild(wrapperDiv);
       
    });

    executeCountdownEngine();
}

function executeCountdownEngine(){
    counterIntervalToken = setInterval(() => {
        secondsRemaining--;
        timeDisplayNode.textContent = secondsRemaining;

        if(secondsRemaining <= 0) {
            clearInterval(counterIntervalToken);
            handleActionSequence();
        }
    },1000);
}

function handleActionSequence() {
    if(!isVerifyingAnswer) {
        verifyCurrentAnswer();
    }else{
        advanceQuizStream();
    }
}

function verifyCurrentAnswer() {
    clearInterval(counterIntervalToken);
    isVerifyingAnswer = true;
    submitButtonNode.disabled = false;
    submitButtonNode.textContent = "Next Question";

    const selectionCheck = document.querySelector('input[name="quiz-selection"]:checked');
    const rightAnswerIndex = quizData[currentQuestionIndex].correct;

    const optionCards = document.querySelectorAll('.option-wrapper');

    optionCards.forEach(card => card.classList.remove('selected'));

    if(selectionCheck) {
        const selectedIndex = parseInt(selectionCheck.value);

        if(selectedIndex === rightAnswerIndex){
            scoreCount++;
            document.querySelector(`.option-wrapper[data-index="${rightAnswerIndex}"]`).classList.add('correct-choice');
        }
        else {
            document.querySelector(`.option-wrapper[data-index="${selectedIndex}"]`).classList.add('incorrect-choice');
            document.querySelector(`.option-wrapper[data-index="${rightAnswerIndex}"]`).classList.add('correct-choice');
        }
    }
    else{
        //User ran out of time
        document.querySelector(`.option-wrapper[data-index="${rightAnswerIndex}"]`).classList.add('correct-choice'); 
    }
}

function advanceQuizStream(){
    currentQuestionIndex++;
    if(currentQuestionIndex < quizData.length){
        renderQuestionIndexStructure();
    }
    else{
        renderFinalEvaluationSummary();
    }
}

function renderFinalEvaluationSummary() {
    quizScreenNode.classList.add('hidden');
    resultsScreenNode.classList.remove('hidden');
    timeDisplayNode.parentElement.classList.add('hidden');
    progressIndicatorNode.style.width = "100%";

    finalScoreNode.textContent = scoreCount;
    totalQuestionsNode.textContent = quizData.length;

    const finalRatio = scoreCount / quizData.length;
    if(finalRatio === 1){
        feedbackTextNode.textContent = "Outstanding result! Mastery Achieved."
    }
    else if(finalRatio >= 0.5){
        feedbackTextNode.textContent = "Keep up the good work!. Review study material."
    }
    else{
        feedbackTextNode.textContent = "Work Hard!!"
    }
}

startButtonNode.addEventListener('click', initializeQuizSession);
submitButtonNode.addEventListener('click', handleActionSequence);
restartButtonNode.addEventListener('click', initializeQuizSession);