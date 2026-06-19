package lms.dto.create;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestAttemptCreateDto {

    @NotNull(message = "ID теста обязателен")
    @Positive(message = "ID теста должен быть положительным")
    private Integer testId;

    @NotNull(message = "ID пользователя обязателен")
    @Positive(message = "ID пользователя должен быть положительным")
    private Integer userId;

    @NotNull(message = "Номер попытки обязателен")
    @Positive(message = "Номер попытки должен быть положительным")
    private Integer attemptNumber;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer score;

    private String status;
}