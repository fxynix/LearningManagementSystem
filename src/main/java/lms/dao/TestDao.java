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
import lms.models.Test;

public class TestDao {

    public void create(Test test) throws SQLException {
        String sql = "INSERT INTO tests (course_id, title, description, content, questions_count, "
                + "start_date, end_date, max_duration_minutes, max_attempts) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, test.getCourseId());
            stmt.setString(2, test.getTitle());
            stmt.setString(3, test.getDescription());
            stmt.setString(4, test.getContent());
            stmt.setInt(5, test.getQuestionsCount());
            stmt.setObject(6, test.getStartDate(), Types.TIMESTAMP);
            stmt.setObject(7, test.getEndDate(), Types.TIMESTAMP);
            stmt.setObject(8, test.getMaxDurationMinutes(), Types.INTEGER);
            stmt.setObject(9, test.getMaxAttempts(), Types.INTEGER);
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    test.setId(keys.getInt(1));
                }
            }
        }
    }

    public Test getById(int id) throws SQLException {
        String sql = "SELECT * FROM tests WHERE id = ?";
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

    public List<Test> getByCourseId(int courseId) throws SQLException {
        List<Test> list = new ArrayList<>();
        String sql = "SELECT * FROM tests WHERE course_id = ? ORDER BY id";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, courseId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public List<Test> getAll() throws SQLException {
        List<Test> list = new ArrayList<>();
        String sql = "SELECT * FROM tests ORDER BY id";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    public void update(Test test) throws SQLException {
        String sql = "UPDATE tests SET course_id=?, title=?, description=?, content=?, "
                + "questions_count=?, start_date=?, end_date=?, max_duration_minutes=?, "
                + "max_attempts=? WHERE id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, test.getCourseId());
            stmt.setString(2, test.getTitle());
            stmt.setString(3, test.getDescription());
            stmt.setString(4, test.getContent());
            stmt.setInt(5, test.getQuestionsCount());
            stmt.setObject(6, test.getStartDate(), Types.TIMESTAMP);
            stmt.setObject(7, test.getEndDate(), Types.TIMESTAMP);
            stmt.setObject(8, test.getMaxDurationMinutes(), Types.INTEGER);
            stmt.setObject(9, test.getMaxAttempts(), Types.INTEGER);
            stmt.setInt(10, test.getId());
            stmt.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM tests WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Test mapRow(ResultSet rs) throws SQLException {
        Test test = new Test();
        test.setId(rs.getInt("id"));
        test.setCourseId(rs.getInt("course_id"));
        test.setTitle(rs.getString("title"));
        test.setDescription(rs.getString("description"));
        test.setContent(rs.getString("content"));
        test.setQuestionsCount(rs.getInt("questions_count"));
        test.setStartDate(rs.getString("start_date"));
        test.setEndDate(rs.getString("end_date"));
        test.setMaxDurationMinutes((Integer) rs.getObject("max_duration_minutes"));
        test.setMaxAttempts((Integer) rs.getObject("max_attempts"));
        test.setCreatedAt(rs.getString("created_at"));
        return test;
    }
}