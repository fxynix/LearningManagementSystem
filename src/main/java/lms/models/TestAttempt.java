package lms.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestAttempt {
    private int id;
    private int testId;
    private int userId;
    private int attemptNumber;
    private String startTime;
    private String endTime;
    private Integer score;
    private String status;
    private String createdAt;
}