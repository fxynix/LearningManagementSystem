package lms.dto.update;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestUpdateDto {

    @Positive(message = "ID курса должен быть положительным")
    private Integer courseId;

    @Size(max = 200, message = "Название теста не должно превышать 200 символов")
    private String title;

    private String description;

    private String content;

    @Positive(message = "Количество вопросов должно быть положительным")
    private Integer questionsCount;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Positive(message = "Максимальная длительность прохождения теста должна быть положительным")
    private Integer maxDurationMinutes;

    @Positive(message = "Максимальное число попыток должно быть положительным")
    private Integer maxAttempts;
}