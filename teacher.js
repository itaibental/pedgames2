document.addEventListener('DOMContentLoaded', () => {
    const topicsContainer = document.getElementById('topics-container');
    const addTopicBtn = document.getElementById('add-topic-btn');
    const saveBtn = document.getElementById('save-btn');
    const saveFeedback = document.getElementById('save-feedback');

    let topicsData = loadData();

    function loadData() {
        const data = localStorage.getItem('wheelGameData');
        return data ? JSON.parse(data) : { topics: [], quizzes: {} };
    }

    function saveData() {
        const topics = [];
        const quizzes = {};
        const topicElements = document.querySelectorAll('.topic');
        topicElements.forEach((topicEl, index) => {
            const topicName = topicEl.querySelector('.topic-name').value.trim();
            if (topicName) {
                topics.push(topicName);
                const questions = [];
                const questionElements = topicEl.querySelectorAll('.question');
                questionElements.forEach(questionEl => {
                    const questionText = questionEl.querySelector('.question-text').value.trim();
                    const correctAnswer = questionEl.querySelector('.correct-answer').value.trim();
                    const options = Array.from(questionEl.querySelectorAll('.option')).map(opt => opt.value.trim());
                    if (questionText && correctAnswer && options.every(opt => opt)) {
                        questions.push({ question: questionText, options: options, correctAnswer: correctAnswer });
                    }
                });
                quizzes[topicName] = { questions: questions };
            }
        });
        topicsData = { topics: topics, quizzes: quizzes };
        localStorage.setItem('wheelGameData', JSON.stringify(topicsData));
        saveFeedback.textContent = 'הנתונים נשמרו בהצלחה!';
        setTimeout(() => { saveFeedback.textContent = '' }, 3000);
    }

    function createTopicElement(topicName = '', quizData = { questions: [] }) {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';
        
        let questionsHtml = '';
        if (quizData.questions) {
            quizData.questions.forEach((q, i) => {
                questionsHtml += `
                    <div class="question">
                        <h4>שאלה ${i + 1}</h4>
                        <label>נוסח השאלה:</label>
                        <textarea class="question-text">${q.question}</textarea>
                        <label>תשובה נכונה:</label>
                        <input type="text" class="correct-answer" value="${q.correctAnswer}">
                        <label>אפשרויות נוספות (3):</label>
                        <input type="text" class="option" value="${q.options[0] || ''}">
                        <input type="text" class="option" value="${q.options[1] || ''}">
                        <input type="text" class="option" value="${q.options[2] || ''}">
                    </div>
                `;
            });
        }

        topicDiv.innerHTML = `
            <h3>מושג חדש</h3>
            <label>שם המושג:</label>
            <input type="text" class="topic-name" value="${topicName}">
            <div class="questions-container">${questionsHtml}</div>
            <button class="btn add-question-btn">הוסף שאלה</button>
            <button class="btn delete delete-topic-btn">מחק מושג</button>
        `;
        topicsContainer.appendChild(topicDiv);

        topicDiv.querySelector('.add-question-btn').addEventListener('click', () => {
            addQuestion(topicDiv.querySelector('.questions-container'));
        });

        topicDiv.querySelector('.delete-topic-btn').addEventListener('click', () => {
            topicDiv.remove();
        });
    }

    function addQuestion(container) {
        const questionCount = container.querySelectorAll('.question').length;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <h4>שאלה ${questionCount + 1}</h4>
            <label>נוסח השאלה:</label>
            <textarea class="question-text"></textarea>
            <label>תשובה נכונה:</label>
            <input type="text" class="correct-answer">
            <label>אפשרויות נוספות (3):</label>
            <input type="text" class="option">
            <input type="text" class="option">
            <input type="text" class="option">
        `;
        container.appendChild(questionDiv);
    }

    function renderTopics() {
        topicsContainer.innerHTML = '';
        if (topicsData.topics.length > 0) {
            topicsData.topics.forEach(topic => {
                createTopicElement(topic, topicsData.quizzes[topic]);
            });
        } else {
            // Add a default empty topic to get started
            createTopicElement();
        }
    }

    addTopicBtn.addEventListener('click', () => createTopicElement());
    saveBtn.addEventListener('click', saveData);

    renderTopics();
});
