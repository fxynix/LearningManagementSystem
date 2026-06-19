package lms.dto.update;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureUpdateDto {

    @Positive(message = "ID курса должен быть положительным")
    private Integer courseId;

    @Size(max = 200, message = "Заголовок не должен превышать 200 символов")
    private String title;

    private String content;

    @Positive(message = "Номер лекции в курсе должен быть положительным")
    private Integer orderNumber;
}