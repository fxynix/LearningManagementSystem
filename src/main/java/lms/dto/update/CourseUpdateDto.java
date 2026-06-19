package lms.dto.update;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseUpdateDto {

    @Size(max = 200, message = "Название курса не должно превышать 200 символов")
    private String title;

    private String description;

    @Positive(message = "ID категории должен быть положительным")
    private Integer categoryId;

    @Positive(message = "ID преподавателя должен быть положительным")
    private Integer teacherId;

    private Set<@Positive(message = "ID роли должен быть положительным") Integer> roleIds;
}