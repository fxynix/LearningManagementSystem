package lms.menus;

import java.sql.SQLException;
import lms.dao.TestDao;
import lms.models.Test;
import lms.utils.ConsoleUtils;

public class TestMenu implements Menu {
    private final TestDao testDao = new TestDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- ТЕСТЫ ---");
            System.out.println("1. Создать");
            System.out.println("2. Найти по ID");
            System.out.println("3. Показать все");
            System.out.println("4. Обновить");
            System.out.println("5. Удалить");
            System.out.println("6. Найти по курсу");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> create();
                    case 2 -> read();
                    case 3 -> ConsoleUtils.printList(testDao.getAll());
                    case 4 -> update();
                    case 5 -> delete();
                    case 6 -> findByCourse();
                    case 0 -> back = true;
                    default -> System.out.println("Неверный ввод.");
                }
            } catch (SQLException e) {
                System.err.println("Ошибка БД: " + e.getMessage());
            }
        }
    }

    private void create() throws SQLException {
        Test t = new Test();
        System.out.print("Введите ID курса: ");
        t.setCourseId(ConsoleUtils.readInt());
        t.setTitle(ConsoleUtils.readString("Название теста: "));
        t.setDescription(ConsoleUtils.readString("Описание: "));
        t.setContent(ConsoleUtils.readString("Содержание (база вопросов): "));
        t.setQuestionsCount(ConsoleUtils.readInt());
        String start = ConsoleUtils.readString(
                "Дата начала (yyyy-MM-dd HH:mm:ss или оставьте пустым): ");
        if (start.isBlank()) {
            t.setStartDate(null);
        } else {
            t.setStartDate(start);
        }
        String end = ConsoleUtils.readString(
                "Дата окончания (yyyy-MM-dd HH:mm:ss или оставьте пустым): ");
        if (end.isBlank()) {
            t.setEndDate(null);
        } else {
            t.setEndDate(end);
        }
        String dur = ConsoleUtils.readString("Макс. длительность (мин, оставьте пустым): ");
        if (dur.isBlank()) {
            t.setMaxDurationMinutes(null);
        } else {
            t.setMaxDurationMinutes(Integer.parseInt(dur));
        }
        String attempts = ConsoleUtils.readString("Макс. попыток (оставьте пустым): ");
        if (attempts.isBlank()) {
            t.setMaxAttempts(null);
        } else {
            t.setMaxAttempts(Integer.parseInt(attempts));
        }
        testDao.create(t);
        System.out.println("Создан тест с ID: " + t.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        Test t = testDao.getById(id);
        if (t != null) {
            System.out.println(t);
        } else {
            System.out.println("Не найден.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID теста для обновления: ");
        int id = ConsoleUtils.readInt();
        Test t = testDao.getById(id);
        if (t == null) {
            System.out.println("Не найден.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val = ConsoleUtils.readString("Новый ID курса: ");
        if (!val.isBlank()) {
            t.setCourseId(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новое название: ");
        if (!val.isBlank()) {
            t.setTitle(val);
        }
        val = ConsoleUtils.readString("Новое описание: ");
        if (!val.isBlank()) {
            t.setDescription(val);
        }
        val = ConsoleUtils.readString("Новое содержание: ");
        if (!val.isBlank()) {
            t.setContent(val);
        }
        val = ConsoleUtils.readString("Новое количество вопросов: ");
        if (!val.isBlank()) {
            t.setQuestionsCount(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новая дата начала (оставьте пустым): ");
        if (!val.isBlank()) {
            t.setStartDate(val);
        }
        val = ConsoleUtils.readString("Новая дата окончания (оставьте пустым): ");
        if (!val.isBlank()) {
            t.setEndDate(val);
        }
        val = ConsoleUtils.readString("Новая макс. длительность (оставьте пустым): ");

        if (val.isBlank()) {
            t.setMaxDurationMinutes(null);
        } else {
            t.setMaxDurationMinutes(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новое макс. попыток (оставьте пустым): ");
        if (val.isBlank()) {
            t.setMaxAttempts(null);
        } else {
            t.setMaxAttempts(Integer.parseInt(val));
        }
        testDao.update(t);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID теста для удаления: ");
        int id = ConsoleUtils.readInt();
        testDao.delete(id);
        System.out.println("Удалено.");
    }

    private void findByCourse() throws SQLException {
        System.out.print("Введите ID курса: ");
        int courseId = ConsoleUtils.readInt();
        ConsoleUtils.printList(testDao.getByCourseId(courseId));
    }
}