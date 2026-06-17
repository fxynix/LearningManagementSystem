package lms.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import lms.DatabaseConnection;
import lms.models.CourseRole;

public class CourseRoleDao {

    public void add(CourseRole courseRole) throws SQLException {
        String sql = "INSERT INTO course_roles (course_id, role_id) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, courseRole.getCourseId());
            stmt.setInt(2, courseRole.getRoleId());
            stmt.executeUpdate();
        }
    }

    public void delete(int courseId, int roleId) throws SQLException {
        String sql = "DELETE FROM course_roles WHERE course_id = ? AND role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, courseId);
            stmt.setInt(2, roleId);
            stmt.executeUpdate();
        }
    }

    public List<CourseRole> getByCourseId(int courseId) throws SQLException {
        List<CourseRole> list = new ArrayList<>();
        String sql = "SELECT * FROM course_roles WHERE course_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, courseId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    CourseRole cr = new CourseRole();
                    cr.setCourseId(rs.getInt("course_id"));
                    cr.setRoleId(rs.getInt("role_id"));
                    list.add(cr);
                }
            }
        }
        return list;
    }

    public List<CourseRole> getByRoleId(int roleId) throws SQLException {
        List<CourseRole> list = new ArrayList<>();
        String sql = "SELECT * FROM course_roles WHERE role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, roleId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    CourseRole cr = new CourseRole();
                    cr.setCourseId(rs.getInt("course_id"));
                    cr.setRoleId(rs.getInt("role_id"));
                    list.add(cr);
                }
            }
        }
        return list;
    }

    public boolean exists(int courseId, int roleId) throws SQLException {
        String sql = "SELECT 1 FROM course_roles WHERE course_id = ? AND role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, courseId);
            stmt.setInt(2, roleId);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }
}