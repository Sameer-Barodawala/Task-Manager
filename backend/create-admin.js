// Script to create admin user with proper password hash
// this file was created because i wasn't able to login to admin so i just created a new file admin user automatically 
// also i know that in the schema.sql there is a insert command im keeping it there as a safegaurd(2 fixes are better than one :)) 

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdminUser() {
    try {
        console.log('==========================================');
        console.log('Creating Admin User for TaskFlow');
        console.log('==========================================\n');
        
        // Hash the password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('1. Password hashed successfully');
        console.log('   Hash:', hashedPassword.substring(0, 30) + '...\n');
        
        // Connect to database
        console.log('2. Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'task_manager'
        });
        console.log('   Connected to database: task_manager\n');

        // Delete existing admin if exists
        console.log('3. Removing old admin user (if exists)...');
        const [deleteResult] = await connection.execute('DELETE FROM users WHERE username = ?', ['admin']);
        if (deleteResult.affectedRows > 0) {
            console.log('   Deleted old admin user\n');
        } else {
            console.log('   No existing admin user found\n');
        }
        
        // Insert new admin user
        console.log('4. Creating new admin user...');
        await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@taskmanager.com', hashedPassword, 'admin']
        );
        console.log('   Admin user created!\n');

        // Verify
        console.log('5. Verifying admin user...');
        const [users] = await connection.execute('SELECT id, username, email, role FROM users WHERE username = ?', ['admin']);
        if (users.length > 0) {
            console.log('   User verified in database:');
            console.log('   - ID:', users[0].id);
            console.log('   - Username:', users[0].username);
            console.log('   - Email:', users[0].email);
            console.log('   - Role:', users[0].role);
        }

        console.log('\n==========================================');
        console.log('✅ SUCCESS! Admin user created');
        console.log('==========================================');
        console.log('\nLogin credentials:');
        console.log('  Username: admin');
        console.log('  Password: admin123');
        console.log('\nYou can now login at: http://localhost:8080');
        console.log('==========================================\n');
        
        await connection.end();
    } catch (error) {
        console.error('\n==========================================');
        console.error('❌ ERROR creating admin user');
        console.error('==========================================');
        console.error('\nError details:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Cannot connect to MySQL database!');
            console.error('   Make sure MySQL is running and .env file is correct\n');
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error('\n⚠️  Database table "users" does not exist!');
            console.error('   Run: mysql -u root -p < database/schema.sql\n');
        }
        
        console.error('==========================================\n');
        process.exit(1);
    }
}

createAdminUser();