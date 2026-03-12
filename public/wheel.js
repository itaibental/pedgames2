document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spin-btn');
    const modal = document.getElementById('question-modal');
    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options');
    const nextQuestionBtn = document.getElementById('next-question-btn');

    let gameData = JSON.parse(localStorage.getItem('wheelGameData')) || {};
    let topics = gameData.topics || [];
    let quizzes = gameData.quizzes || {};
    let currentTopicIndex = 0;
    let currentQuestionIndex = 0;
    let rotation = 0;
    const segmentAngle = 360 / topics.length;

    function createWheel() {
        wheel.innerHTML = '';
        if (topics.length === 0) {
            // Display a message if no topics are set
            const message = document.createElement('div');
            message.textContent = 'יש להגדיר נושאים ושאלות בעמוד המורה.';
            message.style.textAlign = 'center';
            message.style.marginTop = '50px';
            wheel.parentElement.appendChild(message);
            spinBtn.disabled = true;
            return;
        }
        
        topics.forEach((topic, index) => {
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.textContent = topic;
            const rotateAngle = segmentAngle * index + segmentAngle / 2;
            segment.style.transform = `rotate(${rotateAngle}deg) translate(100px) rotate(-90deg)`;
            wheel.appendChild(segment);
        });
    }

    function spinWheel() {
        const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 9 full spins
        const randomStop = Math.floor(Math.random() * 360);
        rotation += (360 * randomSpins) + randomStop;
        
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            const actualRotation = rotation % 360;
            const selectedSegment = Math.floor((360 - actualRotation) / segmentAngle);
            currentTopicIndex = selectedSegment % topics.length;
            showQuestion();
        }, 5000); // Corresponds to the transition duration
    }

    function showQuestion() {
        const topic = topics[currentTopicIndex];
        const quiz = quizzes[topic];
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            alert(`אין שאלות עבור הנושא: ${topic}`);
            return;
        }

        currentQuestionIndex = Math.floor(Math.random() * quiz.questions.length);
        const question = quiz.questions[currentQuestionIndex];

        questionTitle.textContent = topic;
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';

        const allOptions = [question.correctAnswer, ...question.options];
        shuffleArray(allOptions);

        allOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(button, option === question.correctAnswer));
            optionsContainer.appendChild(button);
        });

        modal.style.display = 'flex';
    }

    function checkAnswer(button, isCorrect) {
        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.disabled = true; // Disable all buttons
            if (btn.textContent === (isCorrect ? button.textContent : 'some-other-content')) { // Highlight correct/incorrect
                 if(isCorrect){
                    btn.classList.add( 'correct');
                }else{
                    btn.classList.add( 'incorrect');
                }
            } 
        });

        if (isCorrect) {
            // You can add points or other logic here
        }

        nextQuestionBtn.style.display = 'block';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    nextQuestionBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        nextQuestionBtn.style.display = 'none';
    });

    spinBtn.addEventListener('click', spinWheel);

    createWheel();
});
