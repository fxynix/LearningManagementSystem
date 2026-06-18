package lms.menus;

import java.sql.SQLException;
import lms.dao.UserRoleDao;
import lms.models.UserRole;
import lms.utils.ConsoleUtils;

public class UserRoleMenu implements Menu {
    private final UserRoleDao userRoleDao = new UserRoleDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- СВЯЗИ ПОЛЬЗОВАТЕЛЕЙ И РОЛЕЙ ---");
            System.out.println("1. Назначить роль пользователю");
            System.out.println("2. Удалить роль у пользователя");
            System.out.println("3. Показать роли пользователя");
            System.out.println("4. Показать пользователей с ролью");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> add();
                    case 2 -> delete();
                    case 3 -> getByUser();
                    case 4 -> getByRole();
                    case 0 -> back = true;
                    default -> System.out.println("Неверный ввод.");
                }
            } catch (SQLException e) {
                System.err.println("Ошибка БД: " + e.getMessage());
            }
        }
    }

    private void add() throws SQLException {
        System.out.print("Введите ID пользователя: ");
        int userId = ConsoleUtils.readInt();
        System.out.print("Введите ID роли: ");
        int roleId = ConsoleUtils.readInt();
        UserRole ur = new UserRole(userId, roleId);
        userRoleDao.add(ur);
        System.out.println("Роль назначена.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID пользователя: ");
        int userId = ConsoleUtils.readInt();
        System.out.print("Введите ID роли: ");
        int roleId = ConsoleUtils.readInt();
        userRoleDao.delete(userId, roleId);
        System.out.println("Роль удалена.");
    }

    private void getByUser() throws SQLException {
        System.out.print("Введите ID пользователя: ");
        int userId = ConsoleUtils.readInt();
        ConsoleUtils.printList(userRoleDao.getByUserId(userId));
    }

    private void getByRole() throws SQLException {
        System.out.print("Введите ID роли: ");
        int roleId = ConsoleUtils.readInt();
        ConsoleUtils.printList(userRoleDao.getByRoleId(roleId));
    }
}