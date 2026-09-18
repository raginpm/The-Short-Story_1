package com.shortstory.repository;

import com.shortstory.model.Story;
import com.shortstory.model.StorySummaryResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StoryRepository {
    private final JdbcTemplate jdbcTemplate;

    public StoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long save(Story story) {

        String sql = "INSERT INTO story (user_id, title, content,vilibility) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement preparedStatement = connection.prepareStatement(
                        sql, Statement.RETURN_GENERATED_KEYS);

                preparedStatement.setLong(1, story.getUserId());
                preparedStatement.setString(2, story.getTitle());
                preparedStatement.setString(3, story.getContent());
                preparedStatement.setString(4, story.getVisibility());
                return preparedStatement;
            }
        }, keyHolder);
        Number key = keyHolder.getKey();
        if (key == null) {
            throw new IllegalStateException("Failed to retrieve generated story ID");
        }
        return key.longValue();
    }

    public int updateStory(long id, Story story) {

        String sql =
                "UPDATE story " +
                        "SET title = ?, content = ? ,visibility = ? " +
                        "WHERE story_id = ? AND user_id = ?";

        int rowsUpdated = jdbcTemplate.update(
                sql,
                story.getTitle(),
                story.getContent(),
                story.getVisibility(),
                id,
                story.getUserId()
        );
        return rowsUpdated;
    }

    public Story getStory(long storyId, long userId) {
        String sql =
                "SELECT story_id, title, content " +
                        "FROM story " +
                        "WHERE story_id = ? AND user_id = ?";
        try {
            return jdbcTemplate.queryForObject(
                    sql,
                    (rs, rowNum) -> {
                        Story story = new Story();

                        story.setId(rs.getLong("story_id"));
                        story.setTitle(rs.getString("title"));
                        story.setContent(rs.getString("content"));

                        return story;
                    },
                    storyId,
                    userId
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<StorySummaryResponse> getStoriesByUserId(long userId) {

        String sql =
                "SELECT story_id, title, LEFT(content, 50) AS preview " +
                        "FROM story " +
                        "WHERE user_id = ? " +
                        "ORDER BY updated_at DESC";

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new StorySummaryResponse(
                        rs.getLong("story_id"),
                        rs.getString("title"),
                        rs.getString("preview")
                ),
                userId
        );
    }
}

