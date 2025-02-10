const questions = [{
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
},
{
    question: "What is the name of the fictional wizarding school in Harry Potter?",
    options: ["Beauxbatons", "Hogwarts", "Ilvermorny", "Durmstrang"],
    answer: 1,
    image: "https://www.example.com/harrypotterlogo.png",
},
{
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Planets2013.svg/1024px-Planets2013.svg.png",
},
{
    question: "What is the world’s largest desert?",
    options: ["Gobi Desert", "Kalahari Desert", "Sahara Desert", "Arctic Desert"],
    answer: 2,
    image: "https://www.example.com/saharadesert.jpg",
},
{
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Michelangelo", "Pablo Picasso"],
    answer: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1024px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
},
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const progressElement = document.querySelector(".progress");
const questionImage = document.getElementById("question-image");

// Create a timer display
const timerElement = document.createElement("div");
timerElement.id = "timer";
timerElement.style.position = "absolute";
timerElement.style.top = "10px";
timerElement.style.right = "20px";
timerElement.style.fontSize = "20px";
timerElement.style.fontWeight = "bold";
timerElement.style.color = "white";
document.body.appendChild(timerElement);

function startTimer() {
timeLeft = 30;
updateTimerDisplay();

clearInterval(timer); // Reset any existing timer
timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 5) {
        timerElement.style.color = "red"; // Turn red when less than 5 seconds left
    }

    if (timeLeft === 0) {
        clearInterval(timer);
        autoSubmit();
    }
}, 1000);
}

function updateTimerDisplay() {
timerElement.textContent = `Time Left: ${timeLeft}s`;
}

function loadQuestion() {
if (currentQuestionIndex >= questions.length) {
    showScore();
    return;
}

const currentQuestion = questions[currentQuestionIndex];
questionElement.textContent = currentQuestion.question;
questionImage.src = currentQuestion.image || "https://via.placeholder.com/600x300?text=Image+Not+Available";
optionsElement.innerHTML = "";

currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.classList.add("option");
    li.dataset.index = index;
    li.addEventListener("click", selectOption);
    optionsElement.appendChild(li);
});

progressElement.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
nextButton.disabled = true;

startTimer(); // Restart timer for the new question
}

function selectOption(event) {
clearInterval(timer); // Stop the timer once an option is selected

const selectedOption = event.target;
const selectedIndex = Number(selectedOption.dataset.index);
const correctIndex = questions[currentQuestionIndex].answer;

if (selectedIndex === correctIndex) {
    selectedOption.style.background = "#6a11cb";
    score++;
} else {
    selectedOption.style.background = "#f44336";
}

Array.from(optionsElement.children).forEach((child) => {
    child.removeEventListener("click", selectOption);
    if (Number(child.dataset.index) === correctIndex) {
        child.style.background = "#6a11cb";
    }
});

nextButton.disabled = false;
}

function autoSubmit() {
// Auto-selects the correct answer when time runs out
Array.from(optionsElement.children).forEach((child, index) => {
    child.removeEventListener("click", selectOption);
    if (index === questions[currentQuestionIndex].answer) {
        child.style.background = "#6a11cb";
    }
});

nextButton.disabled = false;
nextButton.click(); // Auto-clicks "Next" to move forward
}

function showScore() {
clearInterval(timer); // Stop the timer
timerElement.style.display = "none"; // Hide timer

const percentage = (score / questions.length) * 100;
let resultMessage = "";
let resultColor = "";
let resultEmoji = "";

if (percentage === 100) {
    resultMessage = "🎉 Perfect Score! You're a genius! 🎉";
    resultColor = "#4caf50";
    resultEmoji = "🌟";
} else if (percentage >= 70) {
    resultMessage = "👏 Great job! Almost perfect!";
    resultColor = "#ffc107";
    resultEmoji = "👍";
} else if (percentage > 0) {
    resultMessage = "🤔 Good effort, but keep learning!";
    resultColor = "#ff9800";
    resultEmoji = "😊";
} else {
    resultMessage = "😢 No correct answers. Try again!";
    resultColor = "#f44336";
    resultEmoji = "🙁";
}

questionElement.textContent = `${resultEmoji} ${resultMessage}`;
optionsElement.innerHTML = "";
questionImage.style.display = "none";
nextButton.style.display = "none";
scoreElement.textContent = `Your score: ${score} out of ${questions.length}`;
scoreElement.style.color = resultColor;
}

nextButton.addEventListener("click", () => {
currentQuestionIndex++;
loadQuestion();
});

loadQuestion();
