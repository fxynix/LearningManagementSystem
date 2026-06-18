package lms.menus;

import java.sql.SQLException;
import lms.dao.UserDao;
import lms.models.User;
import lms.utils.ConsoleUtils;

public class UserMenu implements Menu {
    private final UserDao userDao = new UserDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- ПОЛЬЗОВАТЕЛИ ---");
            System.out.println("1. Создать");
            System.out.println("2. Найти по ID");
            System.out.println("3. Показать всех");
            System.out.println("4. Обновить");
            System.out.println("5. Удалить");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> create();
                    case 2 -> read();
                    case 3 -> ConsoleUtils.printList(userDao.getAll());
                    case 4 -> update();
                    case 5 -> delete();
                    case 0 -> back = true;
                    default -> System.out.println("Неверный ввод.");
                }
            } catch (SQLException e) {
                System.err.println("Ошибка БД: " + e.getMessage());
            }
        }
    }

    private void create() throws SQLException {
        User u = new User();
        u.setUsername(ConsoleUtils.readString("Логин: "));
        u.setEmail(ConsoleUtils.readString("Email: "));
        u.setPassword(ConsoleUtils.readString("Пароль: "));
        u.setFullName(ConsoleUtils.readString("Полное имя: "));
        userDao.create(u);
        System.out.println("Создан пользователь с ID: " + u.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        User u = userDao.getById(id);
        if (u != null) {
            System.out.println(u);
        } else {
            System.out.println("Не найден.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID пользователя для обновления: ");
        int id = ConsoleUtils.readInt();
        User u = userDao.getById(id);
        if (u == null) {
            System.out.println("Не найден.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val;
        val = ConsoleUtils.readString("Новый логин: ");
        if (!val.isBlank()) {
            u.setUsername(val);
        }
        val = ConsoleUtils.readString("Новый email: ");
        if (!val.isBlank()) {
            u.setEmail(val);
        }
        val = ConsoleUtils.readString("Новый пароль: ");
        if (!val.isBlank()) {
            u.setPassword(val);
        }
        val = ConsoleUtils.readString("Новое полное имя: ");
        if (!val.isBlank()) {
            u.setFullName(val);
        }
        userDao.update(u);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID пользователя для удаления: ");
        int id = ConsoleUtils.readInt();
        userDao.delete(id);
        System.out.println("Удалено.");
    }
}