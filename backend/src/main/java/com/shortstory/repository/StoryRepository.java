package com.shortstory.repository;

import com.shortstory.dto.UserCommentRequest;
import com.shortstory.dto.UserCommentResponse;
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

        String sql = "INSERT INTO story (user_id, title, content, visibility) VALUES (?, ?, ?, ?)";
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
                "SELECT story_id, title, content, visibility " +
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
                        story.setVisibility(rs.getString("visibility"));
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
                "SELECT s.story_id, s.title, " +
                        "LEFT(s.content, 50) AS preview, " +
                        "s.visibility, " +
                        "u.user_id, u.username " +
                        "FROM story s " +
                        "JOIN users u ON s.user_id = u.user_id " +
                        "WHERE s.user_id = ? " +
                        "ORDER BY s.updated_at DESC";

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new StorySummaryResponse(
                        rs.getLong("story_id"),
                        rs.getString("title"),
                        rs.getString("preview"),
                        rs.getString("visibility"),
                        rs.getLong("user_id"),
                        rs.getString("username")
                ),
                userId
        );
    }

    public List<StorySummaryResponse> getPublicStories(int page,int size){

        int offset = page*size;
        String sql = "SELECT s.story_id, s.title, " +
                "LEFT(s.content, 50) AS preview, " +
                "s.visibility, " +
                "u.user_id, u.username " +
                "FROM story s " +
                "JOIN users u ON s.user_id = u.user_id " +
                "WHERE s.visibility = 'PUBLIC' " +
                "ORDER BY s.story_id DESC " +
                "LIMIT ? OFFSET ?";

        return jdbcTemplate.query(sql,(resultSet,rowNum)->new StorySummaryResponse(

                resultSet.getLong("story_id"),
                resultSet.getString("title"),
                resultSet.getString("preview"),
                resultSet.getString("visibility"),
                resultSet.getLong("user_id"),
                resultSet.getString("username")
        ),size,offset   );
    }

    public Story getPublicStory(long storyId){
        String sql =
                "SELECT story_id, title, content, visibility " +
                        "FROM story " +
                        "WHERE story_id = ? " +
                        "AND visibility = 'PUBLIC'";
        List<Story> stories = jdbcTemplate.query(sql,(resultSet,rowNum)->{
            Story story = new Story();
            story.setId(resultSet.getLong("story_id"));
            story.setTitle(resultSet.getString("title"));
            story.setContent(resultSet.getString("content"));
            story.setVisibility(resultSet.getString("visibility"));
            return story;
        },storyId);
        if(stories.isEmpty()){
            return null;
        }
        return stories.get(0);
    }
    public List<StorySummaryResponse> getPublicStoriesByUser(long userId, int page, int size){

        int offset = page*size;
        String sql = """
                    SELECT
                        s.story_id,
                        s.title,
                        LEFT(s.content, 50) AS preview,
                        s.visibility,
                        u.user_id,
                        u.username
                    FROM story s
                    JOIN users u
                        ON s.user_id = u.user_id
                    WHERE s.user_id = ?
                      AND s.visibility = 'PUBLIC'
                    ORDER BY s.story_id DESC
                    LIMIT ? OFFSET ?
                    """;
        return jdbcTemplate.query(
                sql,
                (resultSet, rowNum) ->
                        new StorySummaryResponse(
                                resultSet.getLong("story_id"),
                                resultSet.getString("title"),
                                resultSet.getString("preview"),
                                resultSet.getString("visibility"),
                                resultSet.getLong("user_id"),
                                resultSet.getString("username")
                        ),
                userId,
                size,
                offset
        );
    }

    public UserCommentResponse addComment(long storyId, long userId,UserCommentRequest userCommentRequest){
        String sql = "INSERT INTO story_comment (story_id, user_id, content) VALUES (?,?,?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
                PreparedStatement preparedStatement = con.prepareStatement(
                        sql,Statement.RETURN_GENERATED_KEYS
                );
                preparedStatement.setLong(1,storyId);
                preparedStatement.setLong(2,userId);
                preparedStatement.setString(3,userCommentRequest.getContent());
                return preparedStatement;
            }
        },keyHolder);
        Number key = keyHolder.getKey();
        String username = getUsername(userId);
        if (key == null) {
            throw new IllegalStateException("Failed to retrieve generated story ID");
        }
        return new UserCommentResponse(userId,username,userCommentRequest.getContent());
    }

    public String getUsername(long userId) {

        String sql =
                "SELECT username " +
                        "FROM users " +
                        "WHERE user_id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                String.class,
                userId
        );
    }

    public List<UserCommentResponse> getComments(long storyId,int page, int size){

        int offset = page*size;
        String sql = """
                SELECT  sc.`user_id`, u.`username`, sc.`content`
                FROM story_comment sc  JOIN users u ON sc.`user_id` = u.`user_id`  
                WHERE  sc.`story_id` = ? ORDER BY sc.`comment_id` DESC LIMIT ? OFFSET ?
                """;
        return jdbcTemplate.query(sql,(resultSet,rowNum)->
                new UserCommentResponse(
                        resultSet.getLong("user_id"),
                        resultSet.getString("username"),
                        resultSet.getString("content")
                ),storyId,size,offset);
    }

    public long addGoodReview(long storyId,long userId){
        String sql = "INSERT INTO story_good_review (story_id,user_id) VALUES (?,?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
                PreparedStatement preparedStatement = con.prepareStatement(
                        sql,Statement.RETURN_GENERATED_KEYS
                );
                preparedStatement.setLong(1,storyId);
                preparedStatement.setLong(2,userId);
                return preparedStatement;
            }
        },keyHolder);
        Number key = keyHolder.getKey();
        if (key == null) {
            throw new IllegalStateException("Failed to retrieve generated story ID");
        }
        return key.longValue();
    }

    public boolean hasUserLikedStory(long storyId,long userId) {

        String sql =
                "SELECT COUNT(*) " +
                        "FROM story_good_review " +
                        "WHERE user_id = ? " +
                        "AND story_id = ?";

        Integer count =
                jdbcTemplate.queryForObject(
                        sql,
                        Integer.class,
                        userId,
                        storyId
                );

        return count != null && count > 0;
    }
}

