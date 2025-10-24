class SheetsAPI {
    constructor(config) {
        this.scriptUrl = config.scriptUrl;
    }
    
    async sendTestResult(testResult) {
        try {
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentName: testResult.studentName,
                    studentClass: testResult.studentClass,
                    testTitle: testResult.testTitle,
                    correctAnswers: testResult.correctAnswers,
                    totalQuestions: testResult.totalQuestions,
                    percentage: testResult.percentage,
                    grade: testResult.grade
                })
            });
            
            // no-cors mode не возвращает данные, но запрос отправляется
            return { success: true, message: 'Результат отправлен' };
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return { success: false, error: error.message };
        }
    }
}
