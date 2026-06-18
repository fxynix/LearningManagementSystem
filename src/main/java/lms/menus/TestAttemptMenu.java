package lms.menus;

import java.sql.SQLException;
import lms.dao.TestAttemptDao;
import lms.models.TestAttempt;
import lms.utils.ConsoleUtils;

public class TestAttemptMenu implements Menu {
    private final TestAttemptDao testAttemptDao = new TestAttemptDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- ПОПЫТКИ ПРОХОЖДЕНИЯ ТЕСТОВ ---");
            System.out.println("1. Создать");
            System.out.println("2. Найти по ID");
            System.out.println("3. Показать все");
            System.out.println("4. Обновить");
            System.out.println("5. Удалить");
            System.out.println("6. Найти по тесту");
            System.out.println("7. Найти по пользователю");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> create();
                    case 2 -> read();
                    case 3 -> ConsoleUtils.printList(testAttemptDao.getAll());
                    case 4 -> update();
                    case 5 -> delete();
                    case 6 -> findByTest();
                    case 7 -> findByUser();
                    case 0 -> back = true;
                    default -> System.out.println("Неверный ввод.");
                }
            } catch (SQLException e) {
                System.err.println("Ошибка БД: " + e.getMessage());
            }
        }
    }

    private void create() throws SQLException {
        TestAttempt a = new TestAttempt();
        System.out.print("Введите ID теста: ");
        a.setTestId(ConsoleUtils.readInt());
        System.out.print("Введите ID пользователя: ");
        a.setUserId(ConsoleUtils.readInt());
        System.out.print("Введите номер попытки: ");
        a.setAttemptNumber(ConsoleUtils.readInt());
        String start = ConsoleUtils.readString(
                "Время начала (yyyy-MM-dd HH:mm:ss или оставьте пустым): ");
        if (start.isBlank()) {
            a.setStartTime(null);
        } else {
            a.setStartTime(start);
        }
        String end = ConsoleUtils.readString("Время окончания (оставьте пустым): ");
        if (end.isBlank()) {
            a.setEndTime(null);
        } else {
            a.setEndTime(end);
        }
        String score = ConsoleUtils.readString("Балл (оставьте пустым): ");
        if (score.isBlank()) {
            a.setScore(null);
        } else {
            a.setScore(Integer.parseInt(score));
        }
        a.setStatus(ConsoleUtils.readString("Статус (IN_PROGRESS, COMPLETED, FAILED и т.д.): "));
        testAttemptDao.create(a);
        System.out.println("Создана попытка с ID: " + a.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        TestAttempt a = testAttemptDao.getById(id);
        if (a != null) {
            System.out.println(a);
        } else {
            System.out.println("Не найдена.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID попытки для обновления: ");
        int id = ConsoleUtils.readInt();
        TestAttempt a = testAttemptDao.getById(id);
        if (a == null) {
            System.out.println("Не найдена.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val = ConsoleUtils.readString("Новый ID теста: ");
        if (!val.isBlank()) {
            a.setTestId(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новый ID пользователя: ");
        if (!val.isBlank()) {
            a.setUserId(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новый номер попытки: ");
        if (!val.isBlank()) {
            a.setAttemptNumber(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новое время начала (оставьте пустым): ");
        if (!val.isBlank()) {
            a.setStartTime(val);
        }
        val = ConsoleUtils.readString("Новое время окончания (оставьте пустым): ");
        if (!val.isBlank()) {
            a.setEndTime(val);
        }
        val = ConsoleUtils.readString("Новый балл (оставьте пустым): ");
        if (val.isBlank()) {
            a.setScore(null);
        } else {
            a.setScore(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новый статус (оставьте пустым): ");
        if (!val.isBlank()) {
            a.setStatus(val);
        }
        testAttemptDao.update(a);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID попытки для удаления: ");
        int id = ConsoleUtils.readInt();
        testAttemptDao.delete(id);
        System.out.println("Удалено.");
    }

    private void findByTest() throws SQLException {
        System.out.print("Введите ID теста: ");
        int testId = ConsoleUtils.readInt();
        ConsoleUtils.printList(testAttemptDao.getByTestId(testId));
    }

    private void findByUser() throws SQLException {
        System.out.print("Введите ID пользователя: ");
        int userId = ConsoleUtils.readInt();
        ConsoleUtils.printList(testAttemptDao.getByUserId(userId));
    }
}