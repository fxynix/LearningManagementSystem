package lms.menus;

import java.sql.SQLException;
import lms.dao.CourseDao;
import lms.models.Course;
import lms.utils.ConsoleUtils;

public class CourseMenu implements Menu {
    private final CourseDao courseDao = new CourseDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- КУРСЫ ---");
            System.out.println("1. Создать");
            System.out.println("2. Найти по ID");
            System.out.println("3. Показать все");
            System.out.println("4. Обновить");
            System.out.println("5. Удалить");
            System.out.println("6. Найти по категории");
            System.out.println("7. Найти по преподавателю");
            System.out.println("0. Назад");
            System.out.print("Выберите действие: ");
            int choice = ConsoleUtils.readInt();
            try {
                switch (choice) {
                    case 1 -> create();
                    case 2 -> read();
                    case 3 -> ConsoleUtils.printList(courseDao.getAll());
                    case 4 -> update();
                    case 5 -> delete();
                    case 6 -> findByCategory();
                    case 7 -> findByTeacher();
                    case 0 -> back = true;
                    default -> System.out.println("Неверный ввод.");
                }
            } catch (SQLException e) {
                System.err.println("Ошибка БД: " + e.getMessage());
            }
        }
    }

    private void create() throws SQLException {
        Course c = new Course();
        c.setTitle(ConsoleUtils.readString("Название курса: "));
        c.setDescription(ConsoleUtils.readString("Описание: "));
        String cat = ConsoleUtils.readString("ID категории (0 - без категории): ");
        if (cat.isBlank() || cat.equals("0")) {
            c.setCategoryId(null);
        } else {
            c.setCategoryId(Integer.parseInt(cat));
        }
        String teach = ConsoleUtils.readString("ID преподавателя (0 - без преподавателя): ");
        if (teach.isBlank() || teach.equals("0")) {
            c.setTeacherId(null);
        } else {
            c.setTeacherId(Integer.parseInt(teach));
        }
        courseDao.create(c);
        System.out.println("Создан курс с ID: " + c.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        Course c = courseDao.getById(id);
        if (c != null) {
            System.out.println(c);
        } else {
            System.out.println("Не найден.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID курса для обновления: ");
        int id = ConsoleUtils.readInt();
        Course c = courseDao.getById(id);
        if (c == null) {
            System.out.println("Не найден.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val = ConsoleUtils.readString("Новое название: ");
        if (!val.isBlank()) {
            c.setTitle(val);
        }
        val = ConsoleUtils.readString("Новое описание: ");
        if (!val.isBlank()) {
            c.setDescription(val);
        }
        String cat = ConsoleUtils.readString("ID категории (0 - без категории): ");
        if (!cat.isBlank()) {
            if (cat.equals("0")) {
                c.setCategoryId(null);
            } else {
                c.setCategoryId(Integer.parseInt(cat));
            }
        }
        String teach = ConsoleUtils.readString("ID преподавателя (0 - без преподавателя): ");
        if (!teach.isBlank()) {
            if (teach.equals("0")) {
                c.setTeacherId(null);
            } else {
                c.setTeacherId(Integer.parseInt(teach));
            }
        }
        courseDao.update(c);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID курса для удаления: ");
        int id = ConsoleUtils.readInt();
        courseDao.delete(id);
        System.out.println("Удалено.");
    }

    private void findByCategory() throws SQLException {
        System.out.print("Введите ID категории: ");
        int catId = ConsoleUtils.readInt();
        ConsoleUtils.printList(courseDao.getByCategoryId(catId));
    }

    private void findByTeacher() throws SQLException {
        System.out.print("Введите ID преподавателя: ");
        int teachId = ConsoleUtils.readInt();
        ConsoleUtils.printList(courseDao.getByTeacherId(teachId));
    }
}