
document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spin-btn');
    const modal = document.getElementById('question-modal');
    const questionTitle = document.getElementById('question-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.querySelector('.options');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const conceptsContainer = document.querySelector('.concepts');

    let concepts = [];
    let quizzes = {};
    let rotation = 0;

    // Fetch data from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (data.wheelGame && data.wheelGame.topics) {
                concepts = data.wheelGame.topics;
                quizzes = data.wheelGame.quizzes || {};
                if (concepts.length > 0) {
                    createWheel();
                    spinBtn.disabled = false;
                } else {
                    displayNoDataMessage();
                }
            } else {
                displayNoDataMessage();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayNoDataMessage();
        });
    
    function displayNoDataMessage() {
        conceptsContainer.textContent = 'לא נמצאו מושגים. יש להגדיר נושאים ושאלות בקובץ data.json.';
        spinBtn.disabled = true;
    }

    function createWheel() {
        conceptsContainer.innerHTML = '';
        const segmentAngle = 360 / concepts.length;
        const colors = generateColors(concepts.length);
        
        const gradientParts = concepts.map((concept, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            return `${colors[index]} ${startAngle}deg ${endAngle}deg`;
        });
        
        wheel.style.background = `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;

        concepts.forEach((concept, index) => {
            const angle = (index * segmentAngle) + (segmentAngle / 2);
            const textElement = document.createElement('div');
            textElement.className = 'concept';
            textElement.textContent = concept;
            // Position text in a circle around the wheel
            const radius = wheel.offsetWidth / 2 + 30; // 30px padding from the wheel
            const x = Math.cos(angle * Math.PI / 180) * radius + radius - 10;
            const y = Math.sin(angle * Math.PI / 180) * radius + radius - 10;
            //textElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
             textElement.style.transform = `rotate(${angle}deg) translate(140px) rotate(-90deg)`;
            conceptsContainer.appendChild(textElement);
        });
    }

    function generateColors(count) {
        const colors = [];
        const hueStep = 360 / count;
        for (let i = 0; i < count; i++) {
            colors.push(`hsl(${i * hueStep}, 70%, 60%)`);
        }
        return colors;
    }
    
    function spinWheel() {
        const selectedIndex = Math.floor(Math.random() * concepts.length);
        const segmentAngle = 360 / concepts.length;
        // Calculate the angle to stop at the middle of the selected segment
        const stopAngle = (360 - (selectedIndex * segmentAngle) - (segmentAngle / 2)) % 360;
        
        // Add multiple spins for visual effect
        const randomSpins = Math.floor(Math.random() * 4) + 5; // 5 to 8 full spins
        rotation = (360 * randomSpins) + stopAngle;
        
        wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${rotation}deg)`;

        // After the spin animation ends
        setTimeout(() => {
            const currentTopic = concepts[selectedIndex];
            showQuestion(currentTopic);
        }, 5000); 
    }

    function showQuestion(topic) {
        const quiz = quizzes[topic];
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            alert(`אין שאלות עבור הנושא: ${topic}`);
            return;
        }

        const currentQuestionIndex = Math.floor(Math.random() * quiz.questions.length);
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
            button.addEventListener('click', () => checkAnswer(button, option === question.correctAnswer, question.correctAnswer));
            optionsContainer.appendChild(button);
        });

        modal.style.display = 'flex';
    }
    
    function checkAnswer(button, isCorrect, correctAnswer) {
        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === button && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

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
});
