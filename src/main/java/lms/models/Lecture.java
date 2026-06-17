package lms.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lecture {
    private int id;
    private int courseId;
    private String title;
    private String content;
    private Integer orderNumber;
    private String createdAt;
}