package lms.dto.update;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateDto {

    @Size(max = 50, message = "Название роли не должно превышать 50 символов")
    private String name;

    private String description;
}