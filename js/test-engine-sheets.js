class TestEngine {
    constructor(testData, sheetsAPI) {
        this.testData = testData;
        this.sheetsAPI = sheetsAPI;
        this.answers = [];
        this.studentInfo = {};
    }
    
    init() {
        const formHtml = `
            <div class="student-form">
                <h2>Перед началом теста</h2>
                <form id="studentForm">
                    <div class="form-group">
                        <label for="studentName">Фамилия и Имя:</label>
                        <input type="text" id="studentName" required placeholder="Иванов Иван">
                    </div>
                    <div class="form-group">
                        <label for="studentClass">Класс:</label>
                        <input type="text" id="studentClass" required placeholder="9А">
                    </div>
                    <div class="button-group">
                        <button type="submit" class="btn btn-primary">Начать тест</button>
                    </div>
                </form>
            </div>
        `;
        document.getElementById('app').innerHTML = formHtml;
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startTest();
        });
    }
    
    startTest() {
        this.studentInfo = {
            name: document.getElementById('studentName').value.trim(),
            class: document.getElementById('studentClass').value.trim()
        };
        this.answers = new Array(this.testData.questions.length).fill(null);
        this.renderTest();
    }
    
    renderTest() {
        const testHtml = `
            <div class="test-container active">
                <div class="test-header">
                    <h1 class="test-title">${this.testData.title}</h1>
                    <p class="test-info">Ученик: ${this.studentInfo.name} | Класс: ${this.studentInfo.class}</p>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                </div>
                <div id="questionsContainer"></div>
                <div class="button-group">
                    <button id="submitTest" class="btn btn-primary">Завершить тест</button>
                </div>
            </div>
        `;
        document.getElementById('app').innerHTML = testHtml;
        this.renderAllQuestions();
        document.getElementById('submitTest').addEventListener('click', () => this.submitTest());
    }
    
    renderAllQuestions() {
        const container = document.getElementById('questionsContainer');
        this.testData.questions.forEach((q, i) => {
            const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';
            const inputName = `question-${i}`;
            const optionsHtml = q.options.map((opt, j) => `
                <div class="option" data-question="${i}" data-option="${j}">
                    <input type="${inputType}" id="${inputName}-${j}" name="${inputName}" value="${j}">
                    <label for="${inputName}-${j}">${opt}</label>
                </div>
            `).join('');
            container.insertAdjacentHTML('beforeend', `
                <div class="question">
                    <div class="question-number">Вопрос ${i + 1} из ${this.testData.questions.length}</div>
                    <div class="question-text">${q.question}</div>
                    ${q.type === 'multiple' ? '<p style="color: #666; font-size: 0.9rem;">Можно выбрать несколько вариантов</p>' : ''}
                    <div class="options">${optionsHtml}</div>
                </div>
            `);
        });
        document.querySelectorAll('.option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const input = opt.querySelector('input');
                const qIdx = parseInt(opt.dataset.question);
                const oIdx = parseInt(opt.dataset.option);
                if (e.target !== input) {
                    if (input.type === 'radio') input.checked = true;
                    else input.checked = !input.checked;
                }
                this.saveAnswer(qIdx, oIdx, input.type);
                this.updateProgress();
                document.querySelectorAll('.option').forEach(o => {
                    o.classList.toggle('selected', o.querySelector('input').checked);
                });
            });
        });
    }
    
    saveAnswer(qIdx, oIdx, type) {
        if (type === 'radio') {
            this.answers[qIdx] = oIdx;
        } else {
            if (!Array.isArray(this.answers[qIdx])) this.answers[qIdx] = [];
            const idx = this.answers[qIdx].indexOf(oIdx);
            if (idx > -1) this.answers[qIdx].splice(idx, 1);
            else this.answers[qIdx].push(oIdx);
            if (this.answers[qIdx].length === 0) this.answers[qIdx] = null;
        }
    }
    
    updateProgress() {
        const answered = this.answers.filter(a => a !== null).length;
        const progress = (answered / this.testData.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    async submitTest() {
        const unanswered = this.answers.filter(a => a === null).length;
        if (unanswered > 0 && !confirm(`У вас ${unanswered} неотвеченных вопросов. Завершить тест?`)) return;
        const result = this.calculateResults();
        if (this.sheetsAPI) await this.sheetsAPI.sendTestResult(result);
        this.showResults(result);
    }
    
    calculateResults() {
        let correct = 0;
        this.testData.questions.forEach((q, i) => {
            const userAns = this.answers[i];
            const correctAns = q.correct;
            if (q.type === 'multiple') {
                if (Array.isArray(userAns) && Array.isArray(correctAns)) {
                    if (JSON.stringify([...userAns].sort()) === JSON.stringify([...correctAns].sort())) correct++;
                }
            } else {
                if (userAns === correctAns) correct++;
            }
        });
        const total = this.testData.questions.length;
        const pct = Math.round((correct / total) * 100);
        let grade;
        if (pct >= 95) grade = '10';
        else if (pct >= 85) grade = '9';
        else if (pct >= 75) grade = '8';
        else if (pct >= 65) grade = '7';
        else if (pct >= 55) grade = '6';
        else if (pct >= 45) grade = '5';
        else if (pct >= 35) grade = '4';
        else if (pct >= 25) grade = '3';
        else if (pct >= 15) grade = '2';
        else grade = '1';
        return {
            studentName: this.studentInfo.name,
            studentClass: this.studentInfo.class,
            testTitle: this.testData.title,
            correctAnswers: correct,
            totalQuestions: total,
            percentage: pct,
            grade: grade
        };
    }
    
    showResults(r) {
        const emoji = {
            '10': '🏆', '9': '🌟', '8': '⭐', '7': '👍', '6': '✅',
            '5': '📚', '4': '📖', '3': '📝', '2': '📋', '1': '📄'
        }[r.grade];
        const msg = {
            '10': 'Превосходно!', '9': 'Отлично!', '8': 'Очень хорошо!', 
            '7': 'Хорошо!', '6': 'Неплохо', '5': 'Удовлетворительно',
            '4': 'Слабо', '3': 'Плохо', '2': 'Очень плохо', '1': 'Нужно учить!'
        }[r.grade];
        document.getElementById('app').innerHTML = `
            <div class="result-container active">
                <div class="result-icon">${emoji}</div>
                <h2>Тест завершен!</h2>
                <div class="result-score">${r.correctAnswers} из ${r.totalQuestions}</div>
                <div class="result-grade grade-${r.grade}">Оценка: ${r.grade}</div>
                <div class="result-message">${msg}</div>
                <div class="result-details">
                    <p><strong>Ученик:</strong> ${r.studentName}</p>
                    <p><strong>Класс:</strong> ${r.studentClass}</p>
                    <p><strong>Тест:</strong> ${r.testTitle}</p>
                    <p><strong>Процент:</strong> ${r.percentage}%</p>
                </div>
                <div class="button-group">
                    <a href="../../index.html" class="btn btn-primary">Вернуться к списку</a>
                </div>
            </div>
        `;
    }
}
