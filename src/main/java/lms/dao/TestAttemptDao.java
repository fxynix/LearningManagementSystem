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
import lms.models.TestAttempt;

public class TestAttemptDao {

    public void create(TestAttempt attempt) throws SQLException {
        String sql = "INSERT INTO test_attempts (test_id, user_id, attempt_number, start_time, "
                + "end_time, score, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, attempt.getTestId());
            stmt.setInt(2, attempt.getUserId());
            stmt.setInt(3, attempt.getAttemptNumber());
            stmt.setObject(4, attempt.getStartTime(), Types.TIMESTAMP);
            stmt.setObject(5, attempt.getEndTime(), Types.TIMESTAMP);
            stmt.setObject(6, attempt.getScore(), Types.INTEGER);
            stmt.setString(7, attempt.getStatus());
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    attempt.setId(keys.getInt(1));
                }
            }
        }
    }

    public TestAttempt getById(int id) throws SQLException {
        String sql = "SELECT * FROM test_attempts WHERE id = ?";
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

    public List<TestAttempt> getByTestId(int testId) throws SQLException {
        List<TestAttempt> list = new ArrayList<>();
        String sql = "SELECT * FROM test_attempts WHERE test_id = ? "
                + "ORDER BY user_id, attempt_number";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, testId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public List<TestAttempt> getByUserId(int userId) throws SQLException {
        List<TestAttempt> list = new ArrayList<>();
        String sql = "SELECT * FROM test_attempts WHERE user_id = ? "
                + "ORDER BY test_id, attempt_number";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public List<TestAttempt> getAll() throws SQLException {
        List<TestAttempt> list = new ArrayList<>();
        String sql = "SELECT * FROM test_attempts ORDER BY id";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    public void update(TestAttempt attempt) throws SQLException {
        String sql = "UPDATE test_attempts SET test_id=?, user_id=?, attempt_number=?, start_time=?, "
                + "end_time=?, score=?, status=? WHERE id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, attempt.getTestId());
            stmt.setInt(2, attempt.getUserId());
            stmt.setInt(3, attempt.getAttemptNumber());
            stmt.setObject(4, attempt.getStartTime(), Types.TIMESTAMP);
            stmt.setObject(5, attempt.getEndTime(), Types.TIMESTAMP);
            stmt.setObject(6, attempt.getScore(), Types.INTEGER);
            stmt.setString(7, attempt.getStatus());
            stmt.setInt(8, attempt.getId());
            stmt.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM test_attempts WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private TestAttempt mapRow(ResultSet rs) throws SQLException {
        TestAttempt attempt = new TestAttempt();
        attempt.setId(rs.getInt("id"));
        attempt.setTestId(rs.getInt("test_id"));
        attempt.setUserId(rs.getInt("user_id"));
        attempt.setAttemptNumber(rs.getInt("attempt_number"));
        attempt.setStartTime(rs.getString("start_time"));
        attempt.setEndTime(rs.getString("end_time"));
        attempt.setScore((Integer) rs.getObject("score"));
        attempt.setStatus(rs.getString("status"));
        attempt.setCreatedAt(rs.getString("created_at"));
        return attempt;
    }
}