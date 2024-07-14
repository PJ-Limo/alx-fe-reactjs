function checkAnswer() {
    //correct answer
    const correctAnswer = "4";

    //what did user pick
    const userAnswer = document.querySelector('input[name = "quiz"] : checked');

    if (userAnswer ==correctAnswer) {
        document.getElementById("feedback").textContent = "Correct! Well done.";
    }

    else {
        document.getElementById("feedback").textContent = "That's incorrect. Try again!";
    }

    else {
        document.getElementById("feedback").textContent = "Please select an answer.";
    }
}

const submitButton = document.getElementById("submit-answer");
submitButton.addEventListener("click", checkAnswer);