package lms.dto.create;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LectureCreateDto {

    @NotNull(message = "ID курса обязателен")
    @Positive(message = "ID курса должен быть положительным")
    private Integer courseId;

    @NotBlank(message = "Заголовок лекции не может быть пустым")
    @Size(max = 200, message = "Заголовок не должен превышать 200 символов")
    private String title;

    @NotBlank(message = "Содержимое лекции не может быть пустым")
    private String content;

    @Positive(message = "Номер лекции в курсе должен быть положительным")
    private Integer orderNumber;
}