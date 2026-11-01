package com.shortstory.repository;

import com.shortstory.dto.UpdateProfileRequest;
import com.shortstory.dto.UserProfileResponse;
import com.shortstory.model.Story;
import com.shortstory.model.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(User user) {

        String sql =
                "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)";

        jdbcTemplate.update(
                sql,
                user.getUserName(),
                user.getEmail(),
                user.getPassword()
        );
    }

    public User findByUsernameOrEmail(String identifier) {

        String sql =
                "SELECT user_Id, username, email, hashed_password " +
                        "FROM users " +
                        "WHERE username = ? OR email = ?";

        List<User> users = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    User user = new User();

                    user.setId(rs.getLong("user_Id"));
                    user.setUserName(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("hashed_password"));

                    return user;
                },
                identifier,
                identifier
        );

        return users.isEmpty() ? null : users.get(0);
    }

    public boolean emailExists(String userName) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userName);
        return count > 0;
    }

    public boolean userNameExists(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count > 0;
    }

    public User getUserById(long userId) {

        String sql =
                "SELECT user_id, username, email " +
                        "FROM users " +
                        "WHERE user_id = ?";

        try {
            return jdbcTemplate.queryForObject(
                    sql,
                    (rs, rowNum) -> {
                        User user = new User();
                        user.setId(rs.getLong("user_id"));
                        user.setUserName(rs.getString("username"));
                        user.setEmail(rs.getString("email"));
                        return user;
                    },
                    userId
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public UserProfileResponse getUserProfile(long userId){
        String sql =
                "UPDATE users " +
                        "SET nationality = ?, hometown = ?, gender = ? " +
                        "WHERE user_id = ?";

        return jdbcTemplate.queryForObject(sql,(resultSet,rawNum)->new UserProfileResponse(
                resultSet.getLong("user_id"),
                resultSet.getString("username"),
                resultSet.getString("nationality"),
                resultSet.getString("hometown"),
                resultSet.getString("gender")
        ),userId);
    }

    public int updateProfile(long userId, UpdateProfileRequest updateProfileRequest){

        String sql =  "UPDATE users " +
                "SET nationality = ?, hometown = ?, gender = ? " +
                "WHERE user_id = ?";

        return jdbcTemplate.update(sql,
                updateProfileRequest.getNationality(),
                updateProfileRequest.getHometown(),
                updateProfileRequest.getGender(),
                userId
        );
    }

}

