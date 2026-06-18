package lms.menus;

import java.sql.SQLException;
import lms.dao.CourseRoleDao;
import lms.models.CourseRole;
import lms.utils.ConsoleUtils;

public class CourseRoleMenu implements Menu {
    private final CourseRoleDao courseRoleDao = new CourseRoleDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- СВЯЗИ КУРСОВ И РОЛЕЙ ---");
            System.out.println("1. Привязать роль к курсу (доступ)");
            System.out.println("2. Удалить привязку роли к курсу");
            System.out.println("3. Показать роли, привязанные к курсу");
            System.out.println("4. Показать курсы, доступные для роли");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> add();
                    case 2 -> delete();
                    case 3 -> getByCourse();
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
        System.out.print("Введите ID курса: ");
        int courseId = ConsoleUtils.readInt();
        System.out.print("Введите ID роли: ");
        int roleId = ConsoleUtils.readInt();
        CourseRole cr = new CourseRole(courseId, roleId);
        courseRoleDao.add(cr);
        System.out.println("Роль привязана к курсу.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID курса: ");
        int courseId = ConsoleUtils.readInt();
        System.out.print("Введите ID роли: ");
        int roleId = ConsoleUtils.readInt();
        courseRoleDao.delete(courseId, roleId);
        System.out.println("Привязка удалена.");
    }

    private void getByCourse() throws SQLException {
        System.out.print("Введите ID курса: ");
        int courseId = ConsoleUtils.readInt();
        ConsoleUtils.printList(courseRoleDao.getByCourseId(courseId));
    }

    private void getByRole() throws SQLException {
        System.out.print("Введите ID роли: ");
        int roleId = ConsoleUtils.readInt();
        ConsoleUtils.printList(courseRoleDao.getByRoleId(roleId));
    }
}