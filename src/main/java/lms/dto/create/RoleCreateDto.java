package lms.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleCreateDto {

    @NotBlank(message = "Название роли не может быть пустым")
    @Size(max = 50, message = "Название роли не должно превышать 50 символов")
    private String name;

    private String description;
}