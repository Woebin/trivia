window.onload = function() {
    var canvas = document.getElementById("quizCanvas");
    var context = canvas.getContext("2d"); // Canvas is 2D, not 3D.
    var quizbg = new Image();
    var question = new String;
    var option1 = new String;
    var option2 = new String;
    var option3 = new String;
    var my = 0; // Used to track mouse position on click.
    var correctAnswer = 0;
    var qNumber = 0;
    var rightAnswers = 0;
    var wrongAnswers = 0;
    var quizFinished = false;
    var lock = false;
    var textpos1 = 45;
    var textpos2 = 145;
    var textpos3 = 230;
    var textpos4 = 325;

    /**
     * Array of questions.
     * @type {Array}
     */
    var questions = [
        "What is love?",
        "Is this the real life?",
        "Have you ever seen the rain?",
        "Why is this bedroom so cold?",
        "Do you really want to hurt me?"
    ];

    /**
     * Two-dimensional array of answers.
     * @type {Array}
     */
    var options = [
        ["Baby don't hurt me", "Baby please hurt me", "Baby you hurt me"],
        ["Is this just fantasy?", "Is this high fantasy?", "Is this just science fiction?"],
        ["Comin' down on a sunny day?", "Singing falsely on the train?", "Falling into someone's brain?"],
        ["Turned away on your side", "Rolled over on your side", "Riding down your waterslide"],
        ["Do you really want to make me cry?", "Do you really want to be a fly?", "Don't you even want to really try?"]
    ];

    /**
     * Draw background, output question & options.
     */
    quizbg.onload = function() {
            context.drawImage(quizbg, 0, 0);
            setQuestions();
        } //quizbg
    quizbg.src = "quizbg2.png";

/**
 * Output questions & options, scramble option positions.
 */
    setQuestions = function() {

            question = questions[qNumber]; // Fetch question from array.

            correctAnswer = 1 + Math.floor(Math.random() * 3); // Scramble option positions.
            if (correctAnswer == 1) {
                option1 = options[qNumber][0];
                option2 = options[qNumber][1];
                option3 = options[qNumber][2];
            }
            if (correctAnswer == 2) {
                option1 = options[qNumber][2];
                option2 = options[qNumber][0];
                option3 = options[qNumber][1];
            }
            if (correctAnswer == 3) {
                option1 = options[qNumber][1];
                option2 = options[qNumber][2];
                option3 = options[qNumber][0];
            }

            context.textBaseline = "middle";
            context.font = "24pt Calibri, Arial";
            context.fillText(question, 20, textpos1);
            context.font = "18pt Calibri, Arial";
            context.fillText(option1, 20, textpos2);
            context.fillText(option2, 20, textpos3);
            context.fillText(option3, 20, textpos4);
        } //setQuestions

    canvas.addEventListener('click', processClick, false); // Listen for mouse click.

    /**
     * React to mouse clicks.
     * @param  ev = event, i.e. mouseclick
     */
    function processClick(ev) {
        my = ev.y - canvas.offsetTop;
        if (ev.y == undefined) {
            my = ev.pageY - canvas.offsetTop;
        }
        if (lock) { // Move to next question if this one is answered already.
            resetQuestions();
        } else { // Check if answer is correct based on click position, provide feedback.
            if (my > 100 && my < 180) {
                getFeedback(1);
            }
            if (my > 200 && my < 270) {
                getFeedback(2);
            }
            if (my > 290 && my < 360) {
                getFeedback(3);
            }
            progress(); // Trigger progress bar progression.
        }
    } //processClick

    /**
     *     Contínue to next question, end quiz if out of questions.
     */
    resetQuestions = function() {
            lock = false; // Enable answering.
            context.clearRect(0, 0, 550, 400); // Clear previous question from canvas.
            qNumber++; // Go to next question
            if (qNumber == questions.length) { // End quiz if out of questions.
                gameOver();
            } else { // Redraw background, print next question.
                context.drawImage(quizbg, 0, 0);
                setQuestions();
            }
        } //resetQuestions

    /**
     * Add +1 to correct / incorrect count as appropriate, draw correct / incorrect marker, display prompt to continue.
     * @param  a = Selected answer.
     */
    getFeedback = function(a) {
            if (a == correctAnswer) {
                context.drawImage(quizbg, 0, 400, 75, 70, 480, 110 + (90 * (a - 1)), 75, 70); // Params: where in quizbg to fetch image fron (posX, posY), size & where to draw it.
                rightAnswers++; // Add 1 to count of right answers.
            } else {
                context.drawImage(quizbg, 75, 400, 75, 70, 480, 110 + (90 * (a - 1)), 75, 70);
                wrongAnswers++;
            }
            context.font = "14pt Calibri, Arial";
            context.fillText("Click again to continue", 20, 380); // Print prompt to continue near bottom of canvas.
            lock = true; // Disable user from answering multiple times.
        } //getFeedback

    /**
     * End quiz.
     */
    gameOver = function() {
        canvas.removeEventListener('click', processClick, false); // Stop listening for click.
        context.drawImage(quizbg, 0, 0, 550, 90, 0, 0, 550, 400); // Draw game over background.
        context.font = "20pt Calibri, Arial";
        context.fillText("Game Over", 20, 100);
        context.font = "16pt Calibri, Arial";
        context.fillText("Correct answers: " + String(rightAnswers), 20, 200); // Print # of correct answers.
        context.fillText("Incorrect answers: " + String(wrongAnswers), 20, 240); // Print # of incorrect answers.
    }

    /**
     * Progress bar functionality.
     * Progress bar progresses every time use continues to next question.
     */
    function progress() {
        var pBar = document.getElementById("pBar"); // Fetch bar by ID.
        var width = 0; // Set initial width to 0; progress bar is empty on start.

        /**
         * Set delay before progress is drawn (in milliseconds), 0 means no
         * delay (i.e. drawn instantly on function call).
         * Delay number can be removed, as in "setInterval(draw)" being valid,
         * but I've chosen to keep the number for easy reading and editing.
         */
        var id = setInterval(draw, 0);

        function draw() {
          /**
           * Set the width of progress bar portion to be drawn each time
           * function is called. As function is called once per question,
           * the drawn width is one question's percentage value of the total
           * (so all of them together add up to 100 and fill the bar).
           */
            width = (qNumber / questions.length) * 100;

            pBar.style.width = width + '%'; // Draws progress bar.
        }
    }
}; //windowonload
