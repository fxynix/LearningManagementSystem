package lms.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCreateDto {

    @NotBlank(message = "Название категории не может быть пустым")
    @Size(max = 100, message = "Название категории не должно превышать 100 символов")
    private String name;

    private String description;
}