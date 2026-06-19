package lms.dto.update;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {

    @Size(max = 50, message = "Логин не должен превышать 50 символов")
    private String username;

    @Email(message = "Некорректный формат email")
    @Size(max = 100, message = "Email не должен превышать 100 символов")
    private String email;

    @Size(min = 6, max = 255, message = "Пароль должен быть от 6 до 255 символов")
    private String password;

    @Size(max = 100, message = "Полное имя не должно превышать 100 символов")
    private String fullName;

    private Set<@Positive(message = "ID роли должен быть положительным") Integer> roleIds;
}