const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt for username:', username);

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            console.log('User not found:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('User found:', user.username, 'Role:', user.role);
        
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for:', username, 'Role:', user.role);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;