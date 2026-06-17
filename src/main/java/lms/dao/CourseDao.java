package lms.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import lms.DatabaseConnection;
import lms.models.Course;

public class CourseDao {

    public void create(Course course) throws SQLException {
        String sql = "INSERT INTO courses (title, description, category_id, teacher_id) "
                + "VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, course.getTitle());
            stmt.setString(2, course.getDescription());
            if (course.getCategoryId() != null) {
                stmt.setInt(3, course.getCategoryId());
            } else {
                stmt.setNull(3, Types.INTEGER);
            }
            if (course.getTeacherId() != null) {
                stmt.setInt(4, course.getTeacherId());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    course.setId(keys.getInt(1));
                }
            }
        }
    }

    public Course getById(int id) throws SQLException {
        String sql = "SELECT * FROM courses WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
                return null;
            }
        }
    }

    public List<Course> getAll() throws SQLException {
        List<Course> list = new ArrayList<>();
        String sql = "SELECT * FROM courses ORDER BY id";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    public List<Course> getByCategoryId(int categoryId) throws SQLException {
        List<Course> list = new ArrayList<>();
        String sql = "SELECT * FROM courses WHERE category_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, categoryId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public List<Course> getByTeacherId(int teacherId) throws SQLException {
        List<Course> list = new ArrayList<>();
        String sql = "SELECT * FROM courses WHERE teacher_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, teacherId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public void update(Course course) throws SQLException {
        String sql = "UPDATE courses SET title=?, description=?, category_id=?, teacher_id=? "
                + "WHERE id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, course.getTitle());
            stmt.setString(2, course.getDescription());
            if (course.getCategoryId() != null) {
                stmt.setInt(3, course.getCategoryId());
            } else {
                stmt.setNull(3, Types.INTEGER);
            }
            if (course.getTeacherId() != null) {
                stmt.setInt(4, course.getTeacherId());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            stmt.setInt(5, course.getId());
            stmt.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM courses WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Course mapRow(ResultSet rs) throws SQLException {
        Course course = new Course();
        course.setId(rs.getInt("id"));
        course.setTitle(rs.getString("title"));
        course.setDescription(rs.getString("description"));
        course.setCategoryId((Integer) rs.getObject("category_id"));
        course.setTeacherId((Integer) rs.getObject("teacher_id"));
        course.setCreatedAt(rs.getString("created_at"));
        return course;
    }
}