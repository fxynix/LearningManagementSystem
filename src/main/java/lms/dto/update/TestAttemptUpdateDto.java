package lms.dto.update;

import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestAttemptUpdateDto {

    @Positive(message = "ID теста должен быть положительным")
    private Integer testId;

    @Positive(message = "ID пользователя должен быть положительным")
    private Integer userId;

    @Positive(message = "Номер попытки должен быть положительным")
    private Integer attemptNumber;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer score;

    private String status;
}