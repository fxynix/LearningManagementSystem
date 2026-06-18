package lms.utils;

import java.util.List;
import java.util.Scanner;

public class ConsoleUtils {
    private static final Scanner scanner = new Scanner(System.in);

    public static int readInt() {
        try {
            return Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    public static String readString(String prompt) {
        System.out.print(prompt);
        return scanner.nextLine();
    }

    public static void printList(List<?> list) {
        if (list.isEmpty()) {
            System.out.println("Список пуст.");
        } else {
            list.forEach(System.out::println);
        }
    }

    public static void closeScanner() {
        scanner.close();
    }
}