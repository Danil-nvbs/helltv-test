# Docker инструкция

## Быстрый старт

### 1. Создайте файл `.env` в корне проекта:

# Скопируйте в него содержимое файла
 .example.env

# Измените `API_KEY` на ваш секретный ключ!

### 2. Запустите проект:

```bash
docker-compose up -d --build
```

### 3. Проверьте статус:

```bash
docker-compose ps
```

### 4. Просмотр логов:

```bash
# Все логи
docker-compose logs -f

# Только приложение
docker-compose logs -f app

# Только база данных
docker-compose logs -f postgres
```

```

Приложение будет доступно по адресу: `http://localhost:3000`

### Проверка работы API:

```bash
# Создать пользователя
curl -X POST http://localhost:3000/users


# Получить список пользователей
curl http://localhost:3000/users?lastId?lastId={lastId}&take={take}

**Пагинация:
  Для первого запроса используем lastId 0
  Для последующих указываем lastId равное id последнему элементу из последнего запроса**

# Пополнить баланс пользователя с userId
curl -X POST http://localhost:3000/balance/{userId}/credit -H "Content-Type: application/json" -d "{\"amount\": 100, \"description\": \"Тестовое пополнение\"}"

# Списать с баланса
curl -X POST http://localhost:3000/balance/{userId}/debit -H "Content-Type: application/json" -d "{\"amount\": 50, \"description\": \"Тестовое списание\"}"

# Получить историю операций
curl http://localhost:3000/balance/{userId}/history?{lastId}&take={take}

**Пагинация аналогично списку пользователей**
```

