package lms.menus;

import java.sql.SQLException;
import lms.dao.LectureDao;
import lms.models.Lecture;
import lms.utils.ConsoleUtils;

public class LectureMenu implements Menu {
    private final LectureDao lectureDao = new LectureDao();

    @Override
    public void show() {
        boolean back = false;
        while (!back) {
            System.out.println("\n--- ЛЕКЦИИ ---");
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
                    case 3 -> ConsoleUtils.printList(lectureDao.getAll());
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
        Lecture l = new Lecture();
        System.out.print("Введите ID курса: ");
        l.setCourseId(ConsoleUtils.readInt());
        l.setTitle(ConsoleUtils.readString("Заголовок: "));
        l.setContent(ConsoleUtils.readString("Содержание: "));
        String order = ConsoleUtils.readString("Порядковый номер (оставьте пустым): ");
        if (order.isBlank()) {
            l.setOrderNumber(null);
        } else {
            l.setOrderNumber(Integer.parseInt(order));
        }
        lectureDao.create(l);
        System.out.println("Создана лекция с ID: " + l.getId());
    }

    private void read() throws SQLException {
        System.out.print("Введите ID: ");
        int id = ConsoleUtils.readInt();
        Lecture l = lectureDao.getById(id);
        if (l != null) {
            System.out.println(l);
        } else {
            System.out.println("Не найдена.");
        }
    }

    private void update() throws SQLException {
        System.out.print("Введите ID лекции для обновления: ");
        int id = ConsoleUtils.readInt();
        Lecture l = lectureDao.getById(id);
        if (l == null) {
            System.out.println("Не найдена.");
            return;
        }
        System.out.println("Оставить пустым (ввод Enter) - без изменений");
        String val = ConsoleUtils.readString("Новый ID курса: ");
        if (!val.isBlank()) {
            l.setCourseId(Integer.parseInt(val));
        }
        val = ConsoleUtils.readString("Новый заголовок: ");
        if (!val.isBlank()) {
            l.setTitle(val);
        }
        val = ConsoleUtils.readString("Новое содержание: ");
        if (!val.isBlank()) {
            l.setContent(val);
        }
        val = ConsoleUtils.readString("Новый порядковый номер: ");
        if (val.isBlank()) {
            l.setOrderNumber(null);
        } else {
            l.setOrderNumber(Integer.parseInt(val));
        }

        lectureDao.update(l);
        System.out.println("Обновлено.");
    }

    private void delete() throws SQLException {
        System.out.print("Введите ID лекции для удаления: ");
        int id = ConsoleUtils.readInt();
        lectureDao.delete(id);
        System.out.println("Удалено.");
    }

    private void findByCourse() throws SQLException {
        System.out.print("Введите ID курса: ");
        int courseId = ConsoleUtils.readInt();
        ConsoleUtils.printList(lectureDao.getByCourseId(courseId));
    }
}