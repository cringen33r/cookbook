Выполненное ТЗ стажёра на позицию фронтенд-разработчика на Angular.

# Задача
Написание веб-приложения, выполняющего задачи кулинарной книги. CRUD операции над рецептами. Использование Angular v16 и Angular Material.

# Реализация
Приложение состоит из двух частей:
- **Клиент** — Angular 16 + Angular Material
- **Сервер** — Node.js + Express (простое хранение данных в JSON-файле без бд)

Технологии и подходы:
- Angular Standalone Components & Routing
- Signals API
- Reactive Forms
- Observables

# Запуск
1. Установка зависимостей.
2. В `cookbook/server` собрать проект node.js `pnpm build` и запустить api `pnpm start`.
3. В `cookbook/client` локально запустить веб-сервер `pnpm start`.

***Api слушает по 3000 порту***
