package lms.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCreateDto {

    @NotNull(message = "ID курса обязателен")
    @Positive(message = "ID курса должен быть положительным")
    private Integer courseId;

    @NotBlank(message = "Название теста не может быть пустым")
    @Size(max = 200, message = "Название теста не должно превышать 200 символов")
    private String title;

    private String description;

    @NotBlank(message = "Содержание теста не может быть пустым")
    private String content;

    @NotNull(message = "Количество вопросов обязательно")
    @Positive(message = "Количество вопросов должно быть положительным")
    private Integer questionsCount;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Positive(message = "Максимальная длительность прохождения теста должна быть положительным")
    private Integer maxDurationMinutes;

    @Positive(message = "Максимальное число попыток должно быть положительным")
    private Integer maxAttempts;
}