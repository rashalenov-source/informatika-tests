# 🖥️ Тесты по информатике

Система тестирования для учеников 5-11 классов с автоматическим сохранением результатов на GitHub.

## 📋 Возможности

- ✅ Красивый адаптивный дизайн
- ✅ Работает на смартфонах
- ✅ Два типа вопросов: одиночный и множественный выбор
- ✅ Автоматический подсчет результатов
- ✅ Сохранение в GitHub Issues

## 🚀 Быстрый старт

### 1. Настройка GitHub

1. Создайте репозиторий `informatika-tests` для сайта
2. Создайте репозиторий `informatika-tests-results` для результатов
3. Получите Personal Access Token:
   - GitHub → Settings → Developer settings → Tokens (classic)
   - Generate new token
   - Выберите scope: `repo`
4. Отредактируйте `config.js`:
```javascript
const GITHUB_CONFIG = {
    owner: 'ваш-username',
    repo: 'informatika-tests-results',
    token: 'ваш-токен'
};
```

### 2. Публикация на GitHub Pages

1. Загрузите все файлы в репозиторий `informatika-tests`
2. Settings → Pages → Source: main branch
3. Ваш сайт будет доступен по адресу: `https://username.github.io/informatika-tests/`

## 📝 Структура теста

Пример файла теста (`tests/5/test1.html`):

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Информация и информационные процессы</title>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/test.css">
</head>
<body>
    <div class="container">
        <div id="app"></div>
    </div>

    <script src="../../config.js"></script>
    <script src="../../js/github-api.js"></script>
    <script src="../../js/test-engine.js"></script>
    <script>
        const testData = {
            title: "Информация и информационные процессы",
            questions: [
                {
                    question: "Что такое информация?",
                    type: "single",
                    options: [
                        "Данные о мире вокруг нас",
                        "Только цифры",
                        "Программы",
                        "Устройства"
                    ],
                    correct: 0
                },
                {
                    question: "Выберите информационные процессы:",
                    type: "multiple",
                    options: [
                        "Хранение",
                        "Передача",
                        "Обработка",
                        "Уничтожение"
                    ],
                    correct: [0, 1, 2]
                }
            ]
        };

        const github = new GitHubAPI(GITHUB_CONFIG);
        const test = new TestEngine(testData, github);
        test.init();
    </script>
</body>
</html>
```

## 🎨 Критерии оценки

- **5** - 85% и выше
- **4** - 70-84%
- **3** - 50-69%
- **2** - менее 50%

## 📱 Использование

1. Ученик заходит на сайт
2. Выбирает класс
3. Выбирает тест
4. Вводит ФИО и класс
5. Проходит тест
6. Результат сохраняется автоматически

## 🔒 Безопасность

⚠️ НЕ публикуйте `config.js` с токеном в открытый репозиторий!
Файл уже добавлен в `.gitignore`.

---

Успехов в обучении! 🚀
