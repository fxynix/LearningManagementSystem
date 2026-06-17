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
import lms.models.Lecture;

public class LectureDao {

    public void create(Lecture lecture) throws SQLException {
        String sql = "INSERT INTO lectures (course_id, title, content, order_number) "
                + "VALUES (?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, lecture.getCourseId());
            stmt.setString(2, lecture.getTitle());
            stmt.setString(3, lecture.getContent());
            if (lecture.getOrderNumber() != null) {
                stmt.setInt(4, lecture.getOrderNumber());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    lecture.setId(keys.getInt(1));
                }
            }
        }
    }

    public Lecture getById(int id) throws SQLException {
        String sql = "SELECT * FROM lectures WHERE id = ?";
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

    public List<Lecture> getByCourseId(int courseId) throws SQLException {
        List<Lecture> list = new ArrayList<>();
        String sql = "SELECT * FROM lectures WHERE course_id = ? ORDER BY order_number";
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

    public List<Lecture> getAll() throws SQLException {
        List<Lecture> list = new ArrayList<>();
        String sql = "SELECT * FROM lectures ORDER BY id";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    public void update(Lecture lecture) throws SQLException {
        String sql = "UPDATE lectures SET course_id=?, title=?, content=?, order_number=? "
                + "WHERE id=?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, lecture.getCourseId());
            stmt.setString(2, lecture.getTitle());
            stmt.setString(3, lecture.getContent());
            if (lecture.getOrderNumber() != null) {
                stmt.setInt(4, lecture.getOrderNumber());
            } else {
                stmt.setNull(4, Types.INTEGER);
            }
            stmt.setInt(5, lecture.getId());
            stmt.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        String sql = "DELETE FROM lectures WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    private Lecture mapRow(ResultSet rs) throws SQLException {
        Lecture lecture = new Lecture();
        lecture.setId(rs.getInt("id"));
        lecture.setCourseId(rs.getInt("course_id"));
        lecture.setTitle(rs.getString("title"));
        lecture.setContent(rs.getString("content"));
        lecture.setOrderNumber((Integer) rs.getObject("order_number"));
        lecture.setCreatedAt(rs.getString("created_at"));
        return lecture;
    }
}