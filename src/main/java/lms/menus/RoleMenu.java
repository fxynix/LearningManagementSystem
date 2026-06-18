package lms.menus;

import java.sql.SQLException;
import lms.dao.RoleDao;
import lms.models.Role;
import lms.utils.ConsoleUtils;

public class RoleMenu implements Menu {
    private final RoleDao roleDao = new RoleDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- РОЛИ ---");
            System.out.println("1. Создать");
            System.out.println("2. Найти по ID");
            System.out.println("3. Показать все");
            System.out.println("4. Обновить");
            System.out.println("5. Удалить");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> create();
                    case 2 -> read();
                    case 3 -> ConsoleUtils.printList(roleDao.getAll());
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
        Role r = new Role();
        r.setName(ConsoleUtils.readString("Название роли: "));
        r.setDescription(ConsoleUtils.readString("Описание: "));
        roleDao.create(r);
        System.out.println("Создана роль с ID: " + r.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        Role r = roleDao.getById(id);
        if (r != null) {
            System.out.println(r);
        } else {
            System.out.println("Не найдена.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID роли для обновления: ");
        int id = ConsoleUtils.readInt();
        Role r = roleDao.getById(id);
        if (r == null) {
            System.out.println("Не найдена.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val = ConsoleUtils.readString("Новое название: ");
        if (!val.isBlank()) {
            r.setName(val);
        }
        val = ConsoleUtils.readString("Новое описание: ");
        if (!val.isBlank()) {
            r.setDescription(val);
        }
        roleDao.update(r);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID роли для удаления: ");
        int id = ConsoleUtils.readInt();
        roleDao.delete(id);
        System.out.println("Удалено.");
    }
}