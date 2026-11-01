-- Schema for the ShortStory backend (MySQL).
-- Derived from UserRepository and StoryRepository queries.

CREATE DATABASE IF NOT EXISTS ShortStory
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ShortStory;

CREATE TABLE IF NOT EXISTS users (
    user_id         BIGINT       NOT NULL AUTO_INCREMENT,
    username        VARCHAR(50)  NOT NULL,
    email           VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS story (
    story_id   BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    title      VARCHAR(255) NOT NULL,
    content    LONGTEXT     NOT NULL,
    visibility VARCHAR(20)  NULL DEFAULT 'PRIVATE',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id),
    KEY idx_story_user_updated (user_id, updated_at),
    CONSTRAINT fk_story_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE = InnoDB;
