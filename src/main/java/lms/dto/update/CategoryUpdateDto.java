package lms.dto.update;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpdateDto {

    @Size(max = 100, message = "Название категории не должно превышать 100 символов")
    private String name;

    private String description;
}