const topicsList = document.getElementById('topics-list');
const newTopicInput = document.getElementById('new-topic-input');
const addTopicBtn = document.getElementById('add-topic-btn');
const quizTopicSelect = document.getElementById('quiz-topic-select');
const quizEditor = document.getElementById('quiz-editor');
const saveChangesBtn = document.getElementById('save-changes-btn');

let gameData = {};

function renderTopics() {
  topicsList.innerHTML = '';
  gameData.topics.forEach(topic => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="text" value="${topic}">
      <button class="delete-topic-btn">מחק</button>
    `;
    topicsList.appendChild(li);
  });

  quizTopicSelect.innerHTML = '';
  gameData.topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic;
    option.textContent = topic;
    quizTopicSelect.appendChild(option);
  });
}

function renderQuiz(topic) {
  quizEditor.innerHTML = '';
  const quiz = gameData.quizzes[topic];
  if (quiz) {
    quiz.questions.forEach((q, qIndex) => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');
      questionDiv.innerHTML = `
        <label>שאלה:</label>
        <input type="text" class="question-text" value="${q.question}">
        <button class="delete-question-btn">מחק שאלה</button>
        <ul class="options">
          ${q.options.map((opt, oIndex) => `
            <li>
              <input type="radio" name="correct-${qIndex}" ${opt === q.correctAnswer ? 'checked' : ''}>
              <input type="text" class="option-text" value="${opt}">
              <button class="delete-option-btn">מחק אפשרות</button>
            </li>
          `).join('')}
        </ul>
        <button class="add-option-btn">הוסף אפשרות</button>
      `;
      quizEditor.appendChild(questionDiv);
    });
  }
  const addQuestionBtn = document.createElement('button');
  addQuestionBtn.textContent = 'הוסף שאלה';
  addQuestionBtn.addEventListener('click', () => addQuestion(topic));
  quizEditor.appendChild(addQuestionBtn);
}

function addQuestion(topic) {
    if (!gameData.quizzes[topic]) {
        gameData.quizzes[topic] = { questions: [] };
    }
    gameData.quizzes[topic].questions.push({
        question: 'שאלה חדשה',
        options: ['אפשרות 1', 'אפשרות 2'],
        correctAnswer: 'אפשרות 1'
    });
    renderQuiz(topic);
}

function updateDataFromUI() {
  const newTopics = [];
  topicsList.querySelectorAll('li input[type="text"]').forEach(input => {
    newTopics.push(input.value);
  });
  gameData.topics = newTopics;

  const topic = quizTopicSelect.value;
  const newQuestions = [];
  quizEditor.querySelectorAll('.question').forEach(qDiv => {
    const question = qDiv.querySelector('.question-text').value;
    const options = [];
    let correctAnswer = '';
    qDiv.querySelectorAll('.options li').forEach(optLi => {
        const optionText = optLi.querySelector('.option-text').value;
        options.push(optionText);
        if (optLi.querySelector('input[type="radio"]').checked) {
            correctAnswer = optionText;
        }
    });
    newQuestions.push({ question, options, correctAnswer });
  });
  if (gameData.quizzes[topic]) {
    gameData.quizzes[topic].questions = newQuestions;
  }
}

// Event Listeners
addTopicBtn.addEventListener('click', () => {
  const newTopic = newTopicInput.value.trim();
  if (newTopic && !gameData.topics.includes(newTopic)) {
    gameData.topics.push(newTopic);
    newTopicInput.value = '';
    renderTopics();
  }
});

quizTopicSelect.addEventListener('change', () => {
  renderQuiz(quizTopicSelect.value);
});

saveChangesBtn.addEventListener('click', () => {
    updateDataFromUI();
    // This will be replaced with a call to the backend
    console.log('Saving:', gameData);
    fetch('/api/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('השינויים נשמרו בהצלחה!');
        } else {
            alert('שגיאה בשמירת השינויים.');
        }
    });
});

// Initial load
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    gameData = data;
    renderTopics();
    renderQuiz(gameData.topics[0]);
  });

