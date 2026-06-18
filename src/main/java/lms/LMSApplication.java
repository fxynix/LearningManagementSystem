package lms;

import lms.menus.*;
import lms.utils.ConsoleUtils;

public class LMSApplication {

    public static void main(String[] args) {
        boolean exit = false;
        while (!exit) {
            System.out.println("\n=== ГЛАВНОЕ МЕНЮ ===");
            System.out.println("1. Пользователи");
            System.out.println("2. Роли");
            System.out.println("3. Категории курсов");
            System.out.println("4. Курсы");
            System.out.println("5. Лекции");
            System.out.println("6. Тесты");
            System.out.println("7. Попытки прохождения тестов");
            System.out.println("8. Связи пользователей и ролей");
            System.out.println("9. Связи курсов и ролей");
            System.out.println("0. Выход");
            System.out.print("Выберите пункт: ");
            int choice = ConsoleUtils.readInt();
            switch (choice) {
                case 1 -> new UserMenu().show();
                case 2 -> new RoleMenu().show();
                case 3 -> new CategoryMenu().show();
                case 4 -> new CourseMenu().show();
                case 5 -> new LectureMenu().show();
                case 6 -> new TestMenu().show();
                case 7 -> new TestAttemptMenu().show();
                case 8 -> new UserRoleMenu().show();
                case 9 -> new CourseRoleMenu().show();
                case 0 -> exit = true;
                default -> System.out.println("Неверный ввод.");
            }
        }
        ConsoleUtils.closeScanner();
    }
}