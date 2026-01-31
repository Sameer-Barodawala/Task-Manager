const express = require('express');
const db = require('../config/db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, username, email, role, created_at FROM users'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user statistics
router.get('/users/:id/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [taskStats] = await db.execute(
            `SELECT 
                COUNT(*) as total_tasks,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
            FROM tasks WHERE user_id = ?`,
            [id]
        );

        const [user] = await db.execute(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: user[0],
            stats: taskStats[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
});

// Get all users with their task progress
router.get('/progress', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [results] = await db.execute(
            `SELECT 
                u.id, 
                u.username, 
                u.email,
                u.created_at,
                COUNT(t.id) as total_tasks,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
                SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
            FROM users u
            LEFT JOIN tasks t ON u.id = t.user_id
            WHERE u.role = 'user'
            GROUP BY u.id, u.username, u.email, u.created_at`
        );

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress data' });
    }
});

// Delete user
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute('DELETE FROM users WHERE id = ? AND role != "admin"', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or cannot delete admin' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;