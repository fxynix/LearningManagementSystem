package lms.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import lms.DatabaseConnection;
import lms.models.UserRole;

public class UserRoleDao {

    public void add(UserRole userRole) throws SQLException {
        String sql = "INSERT INTO users_roles (user_id, role_id) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userRole.getUserId());
            stmt.setInt(2, userRole.getRoleId());
            stmt.executeUpdate();
        }
    }

    public void delete(int userId, int roleId) throws SQLException {
        String sql = "DELETE FROM users_roles WHERE user_id = ? AND role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, roleId);
            stmt.executeUpdate();
        }
    }

    public List<UserRole> getByUserId(int userId) throws SQLException {
        List<UserRole> list = new ArrayList<>();
        String sql = "SELECT * FROM users_roles WHERE user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    UserRole ur = new UserRole();
                    ur.setUserId(rs.getInt("user_id"));
                    ur.setRoleId(rs.getInt("role_id"));
                    list.add(ur);
                }
            }
        }
        return list;
    }

    public List<UserRole> getByRoleId(int roleId) throws SQLException {
        List<UserRole> list = new ArrayList<>();
        String sql = "SELECT * FROM users_roles WHERE role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, roleId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    UserRole ur = new UserRole();
                    ur.setUserId(rs.getInt("user_id"));
                    ur.setRoleId(rs.getInt("role_id"));
                    list.add(ur);
                }
            }
        }
        return list;
    }

    public boolean exists(int userId, int roleId) throws SQLException {
        String sql = "SELECT 1 FROM users_roles WHERE user_id = ? AND role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, roleId);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }
}