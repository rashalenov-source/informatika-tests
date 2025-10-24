class GitHubAPI {
    constructor(config) {
        this.owner = config.owner;
        this.repo = config.repo;
        this.token = config.token;
        this.apiUrl = 'https://api.github.com';
    }
    async sendTestResult(testResult) {
        const issueTitle = `Тест: ${testResult.studentName} - ${testResult.testTitle}`;
        const date = new Date().toLocaleString('ru-RU');
        const issueBody = `
## 📊 Результаты теста

**Ученик:** ${testResult.studentName}  
**Класс:** ${testResult.studentClass}  
**Тема теста:** ${testResult.testTitle}  
**Дата:** ${date}

**Правильных ответов:** ${testResult.correctAnswers} из ${testResult.totalQuestions}
**Процент:** ${testResult.percentage}%
**Оценка:** **${testResult.grade}**
        `.trim();
        
        try {
            const response = await fetch(`${this.apiUrl}/repos/${this.owner}/${this.repo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    title: issueTitle,
                    body: issueBody,
                    labels: ['test-result', `class-${testResult.studentClass}`]
                })
            });
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            const data = await response.json();
            return { success: true, issueUrl: data.html_url };
        } catch (error) {
            console.error('Ошибка:', error);
            return { success: false, error: error.message };
        }
    }
}
