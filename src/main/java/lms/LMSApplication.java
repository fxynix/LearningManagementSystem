package lms;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LMSApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String host = dotenv.get("POSTGRES_HOST", "localhost");
        String db = dotenv.get("POSTGRES_DB");
        String user = dotenv.get("POSTGRES_USER");
        String password = dotenv.get("POSTGRES_PASSWORD");

        System.setProperty("POSTGRES_URL", "jdbc:postgresql://" + host + ":5432/" + db);
        System.setProperty("POSTGRES_USER", user);
        System.setProperty("POSTGRES_PASSWORD", password);

        SpringApplication.run(LMSApplication.class, args);
    }
}