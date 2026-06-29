## LMS

LMS (Learning Management System) — система управления обучением, предназначенная для организации курсов, лекций и тестирования студентов.

---

## Оценка времени на задания 

Оценка времени на задания производилось по методу оценки по трём точкам. Для этого использовалась формула:

$$
E = (P + O + 4 * BG) /  6,
$$

где:
* P — пессимистичная оценка;<br>
* O — оптимистичная оценка;<br>
* BG — это наиболее вероятная оценка.<br>

Результаты представлены в таблице:

| Задача      | P  | O  | BG | **Оценочное время (E)** | **Фактически затраченное время** |
|:------------|:---|:---|:---|:------------------------|:---------------------------------|
| БД          | 6  | 2  | 4  | 4,0                     | 3,2                              |
| JDBC        | 9  | 5  | 6  | 6,3                     | 7,0                              |
| Backend     | 12 | 7  | 9  | 9,2                     | 8,2                              |
| React       | 16 | 9  | 11 | 11,5                    | 12,3                             |
| Angular     | 20 | 10 | 13 | 13,7                    | 13,0                             |
| Docker      | 6  | 3  | 4  | 4,2                     | 3,5                              |

---

## Sonar Cloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fxynix_LearningManagementSystem&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fxynix_LearningManagementSystem)

Посмотреть [Sonar](https://sonarcloud.io/project/overview?id=fxynix_LearningManagementSystem)

---

## Запуск через Docker

1. Скопировать файл `.env`:
   ```bash
   copy .env.example .env
   ```
2. Задать переменные окружения в `.env`
3. Поднять проект:
   ```bash
   docker-compose up --build
   ```
4. Посмотреть [Swagger](http://localhost:8080/swagger-ui/index.html)
5. Посмотреть [React](http://localhost:3000/)
6. Посмотреть [Angular](http://localhost:4200/)

