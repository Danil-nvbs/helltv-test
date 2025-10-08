# Docker инструкция

## Быстрый старт

### 1. Создайте файл `.env` в корне проекта:

```bash
# Скопируйте пример файла
cp .example.env .env
```

Или создайте вручную `.env` с таким содержимым:

```env
# App
NODE_ENV=production
PORT=3000
API_KEY=my-api-key

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=helltv
DB_SSL=false
```

**Важно:** Измените `API_KEY` на ваш секретный ключ!

### 2. Запустите проект:

```bash
docker-compose up -d
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

## Полезные команды

### Остановить контейнеры:
```bash
docker-compose down
```

### Остановить и удалить данные:
```bash
docker-compose down -v
```

### Пересобрать приложение:
```bash
docker-compose up -d --build
```

### Выполнить seed скрипт вручную:
```bash
docker-compose exec app node dist/scripts/seed.js
```

**Примечание:** Seed скрипт автоматически выполняется при запуске контейнера!

## Доступ к приложению

Приложение будет доступно по адресу: `http://localhost:3000`

### Проверка работы API:

```bash
# Создать пользователя
curl -X POST http://localhost:3000/users

# Получить список пользователей
curl http://localhost:3000/users

# Пополнить баланс (замените {userId} на ID пользователя)
curl -X POST http://localhost:3000/balance/{userId}/credit -H "Content-Type: application/json" -d "{\"amount\": 100, \"description\": \"Тестовое пополнение\"}"

# Списать с баланса
curl -X POST http://localhost:3000/balance/{userId}/debit -H "Content-Type: application/json" -d "{\"amount\": 50, \"description\": \"Тестовое списание\"}"

# Получить историю операций
curl http://localhost:3000/balance/{userId}/history
```

## Структура

- **app**: NestJS приложение (порт 3000)
  - При старте автоматически выполняет seed скрипт
  - Затем запускает приложение
- **postgres**: PostgreSQL база данных (доступна только внутри Docker сети)
- **postgres_data**: Volume для хранения данных БД

## Примечания

- PostgreSQL доступен только внутри Docker сети, снаружи его нельзя достать
- Данные БД хранятся в Docker volume `postgres_data`
- При первом запуске автоматически применятся миграции (synchronize: true)

