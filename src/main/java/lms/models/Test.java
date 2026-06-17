package lms.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Test {
    private int id;
    private int courseId;
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private Integer maxDurationMinutes;
    private Integer maxAttempts;
    private String createdAt;
}