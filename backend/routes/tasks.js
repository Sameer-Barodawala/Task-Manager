const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create new task
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, status, priority, category, due_date, tags } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title, description, status, priority, category, due_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, title, description || '', status || 'pending', priority || 'medium', category || null, due_date || null, tags || null]
        );

        // Fetch the created task
        const [newTask] = await db.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({ 
            message: 'Task created successfully', 
            task: newTask[0]
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, category, due_date, tags } = req.body;

        const [result] = await db.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, category = ?, due_date = ?, tags = ? WHERE id = ? AND user_id = ?',
            [title, description, status, priority, category || null, due_date || null, tags || null, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Fetch the updated task
        const [updatedTask] = await db.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        res.json({ 
            message: 'Task updated successfully',
            task: updatedTask[0]
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ 
            message: 'Task deleted successfully',
            taskId: parseInt(id)
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;