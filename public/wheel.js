const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const quizContainer = document.getElementById('quiz-container');
const topicTitle = document.getElementById('topic-title');
const quizDiv = document.getElementById('quiz');
const submitQuizBtn = document.getElementById('submit-quiz');
const quizResult = document.getElementById('quiz-result');

let topics = [];
let quizzes = {};
let arc = 0;

let startAngle = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
  if (!canvas.getContext) return;
  arc = Math.PI / (topics.length / 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#000';
  ctx.font = '18px Arial';

  for (let i = 0; i < topics.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = i % 2 === 0 ? '#f0f0f0' : '#ffffff';

    ctx.beginPath();
    ctx.arc(250, 250, 250, angle, angle + arc, false);
    ctx.arc(250, 250, 0, angle + arc, angle, true);
    ctx.stroke();
    ctx.fill();

    ctx.save();
    ctx.fillStyle = '#000';
    ctx.translate(250 + Math.cos(angle + arc / 2) * 200, 250 + Math.sin(angle + arc / 2) * 200);
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    const text = topics[i];
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  const topic = topics[index];
  showQuiz(topic);
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

function showQuiz(topic) {
  const quiz = quizzes[topic];
  if (quiz) {
    topicTitle.textContent = topic;
    quizDiv.innerHTML = '';
    quiz.questions.forEach((q, index) => {
      const questionEl = document.createElement('div');
      questionEl.classList.add('question');
      questionEl.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
      const optionsList = document.createElement('ul');
      optionsList.classList.add('options');
      q.options.forEach(option => {
        const li = document.createElement('li');
        li.innerHTML = `<label><input type="radio" name="question-${index}" value="${option}"> ${option}</label>`;
        optionsList.appendChild(li);
      });
      questionEl.appendChild(optionsList);
      quizDiv.appendChild(questionEl);
    });
    quizContainer.style.display = 'block';
  }
}

function handleSubmit() {
  const topic = topicTitle.textContent;
  const quiz = quizzes[topic];
  let score = 0;
  quiz.questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="question-${index}"]:checked`);
    if (selected && selected.value === q.correctAnswer) {
      score++;
    }
  });
  quizResult.textContent = `Your score: ${score} out of ${quiz.questions.length}`;
}

spinBtn.addEventListener('click', () => {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
});

submitQuizBtn.addEventListener('click', handleSubmit);

// Fetch data and initialize the game
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    topics = data.topics;
    quizzes = data.quizzes;
    drawWheel();
  });
