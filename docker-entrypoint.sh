#!/bin/sh
set -e

echo "Запуск seed скрипта..."
node dist/scripts/seed.js || echo "Seed выполнен или пропущен"

echo "Запуск приложения..."
exec node dist/src/main

