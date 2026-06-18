package lms.menus;

import java.sql.SQLException;
import lms.dao.CategoryDao;
import lms.models.Category;
import lms.utils.ConsoleUtils;

public class CategoryMenu implements Menu {
    private final CategoryDao categoryDao = new CategoryDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- КАТЕГОРИИ ---");
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
                    case 3 -> ConsoleUtils.printList(categoryDao.getAll());
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
        Category c = new Category();
        c.setName(ConsoleUtils.readString("Название категории: "));
        c.setDescription(ConsoleUtils.readString("Описание: "));
        categoryDao.create(c);
        System.out.println("Создана категория с ID: " + c.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        Category c = categoryDao.getById(id);
        if (c != null) {
            System.out.println(c);
        } else {
            System.out.println("Не найдена.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID категории для обновления: ");
        int id = ConsoleUtils.readInt();
        Category c = categoryDao.getById(id);
        if (c == null) {
            System.out.println("Не найдена.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val = ConsoleUtils.readString("Новое название: ");
        if (!val.isBlank()) {
            c.setName(val);
        }
        val = ConsoleUtils.readString("Новое описание: ");
        if (!val.isBlank()) {
            c.setDescription(val);
        }
        categoryDao.update(c);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID категории для удаления: ");
        int id = ConsoleUtils.readInt();
        categoryDao.delete(id);
        System.out.println("Удалено.");
    }
}