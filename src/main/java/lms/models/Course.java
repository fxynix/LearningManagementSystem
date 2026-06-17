package lms.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    private int id;
    private String title;
    private String description;
    private Integer categoryId;
    private Integer teacherId;
    private String createdAt;
}