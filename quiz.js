function checkAnswer() {
    //correct answer
    let correctAnswer = "4";

    //what did user pick
    let userAnswer = document.querySelector('input[name = "quiz"] : checked').value;
    console.log(userAnswer);

    if (userAnswer === correctAnswer) {
        let feedback = document.getElementById("feedback");
        feedback.textContent = "Correct! Well done.";
    }

    else {
      feedback.textContent = "That's incorrect. Try again!";
    }
}

let submitButton = document.querySelector("#submit-answer");
submitButton.addEventListener("click", checkAnswer);