# Калькулятор для проектирования электрических подстанций

Веб-приложение для помощи инженерам-проектировщикам электрических подстанций в расчетах и выборе оборудования.

## Функциональность

- Расчет токов короткого замыкания
- Выбор оборудования:
  - Выключатели
  - Разъединители
  - Трансформаторы тока
  - Трансформаторы напряжения
  - Ошиновка
- Расчет заземляющих устройств
- Расчет и выбор релейной защиты
- Расчет молниезащиты

## Технологии

- React 18
- TypeScript
- Material-UI
- Vite

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/KirillKolobov/substation-calculator.git
```

2. Перейдите в директорию проекта:
```bash
cd substation-calculator
```

3. Установите зависимости:
```bash
npm install
```

4. Запустите приложение в режиме разработки:
```bash
npm run dev
```

5. Откройте [http://localhost:5173](http://localhost:5173) в браузере.

## Сборка для production

Для создания production-сборки выполните:

```bash
npm run build
```

Готовая сборка будет находиться в директории `dist`.
