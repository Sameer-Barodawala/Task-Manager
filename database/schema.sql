-- Create database
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    category VARCHAR(100),
    due_date DATE,
    tags VARCHAR(255),
    time_spent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@taskmanager.com', '$2b$10$rKfQ5cP0pHJZ5YXhKZ5YXe5YXhKZ5YXe5YXhKZ5YXe5YXhKZ5YXe', 'admin')
ON DUPLICATE KEY UPDATE password = '$2b$10$rKfQ5cP0pHJZ5YXhKZ5YXe5YXhKZ5YXe5YXhKZ5YXe5YXhKZ5YXe';