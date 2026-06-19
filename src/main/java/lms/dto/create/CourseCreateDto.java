package lms.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseCreateDto {

    @NotBlank(message = "Название курса не может быть пустым")
    @Size(max = 200, message = "Название курса не должно превышать 200 символов")
    private String title;

    private String description;

    @Positive(message = "ID категории должен быть положительным")
    private Integer categoryId;

    @NotNull(message = "ID преподавателя обязателен")
    @Positive(message = "ID преподавателя должен быть положительным")
    private Integer teacherId;

    private Set<Integer> roleIds;
}