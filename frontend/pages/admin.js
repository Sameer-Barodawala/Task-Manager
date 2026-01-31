// Admin Page
class AdminPage {
    constructor() {
        this.users = [];
        this.navbar = new Navbar();
    }

    async loadData() {
        try {
            this.users = await API.getProgress();
            this.updateDisplay();
        } catch (error) {
            console.error('Load admin data error:', error);
            Helpers.showNotification('Failed to load admin data', 'error');
        }
    }

    updateDisplay() {
        const totalTasks = this.users.reduce((sum, u) => sum + parseInt(u.total_tasks || 0), 0);
        const completedTasks = this.users.reduce((sum, u) => sum + parseInt(u.completed_tasks || 0), 0);

        // Update stats
        const statsContainer = document.querySelector('.dashboard-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-label">Total Users</div>
                    <div class="stat-value">${this.users.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Tasks</div>
                    <div class="stat-value">${totalTasks}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value">${completedTasks}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Completion Rate</div>
                    <div class="stat-value">${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</div>
                </div>
            `;
        }

        // Update table
        const tbody = document.querySelector('.admin-table tbody');
        if (tbody) {
            tbody.innerHTML = this.users.length === 0 ? `
                <tr>
                    <td colspan="7" class="empty-state" style="padding: 3rem;">
                        No users found
                    </td>
                </tr>
            ` : this.users.map(user => `
                <tr>
                    <td><strong>${user.username}</strong></td>
                    <td>${user.email}</td>
                    <td>${user.total_tasks}</td>
                    <td><span class="badge badge-success">${user.completed_tasks}</span></td>
                    <td><span class="badge badge-info">${user.in_progress_tasks}</span></td>
                    <td><span class="badge badge-warning">${user.pending_tasks}</span></td>
                    <td>
                        <button class="btn btn-ghost btn-sm delete-user-btn" data-user-id="${user.id}" data-username="${user.username}">
                            🗑️ Delete
                        </button>
                    </td>
                </tr>
            `).join('');

            // Re-attach delete listeners
            this.attachDeleteListeners();
        }
    }

    attachDeleteListeners() {
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = parseInt(e.currentTarget.dataset.userId);
                const username = e.currentTarget.dataset.username;
                
                if (confirm(`Are you sure you want to delete user "${username}"?`)) {
                    try {
                        await API.deleteUser(userId);
                        Helpers.showNotification('User deleted successfully! 🗑️', 'success');
                        await this.loadData();
                    } catch (error) {
                        console.error('Delete user error:', error);
                        Helpers.showNotification(error.message || 'Failed to delete user', 'error');
                    }
                }
            });
        });
    }

    render() {
        const user = Storage.getUser();
        const totalTasks = this.users.reduce((sum, u) => sum + parseInt(u.total_tasks || 0), 0);
        const completedTasks = this.users.reduce((sum, u) => sum + parseInt(u.completed_tasks || 0), 0);

        const html = `
            <div class="dashboard-page page">
                ${this.navbar.render(user)}
                
                <div class="container">
                    <div class="admin-header">
                        <h1 class="admin-title">👑 Admin Dashboard</h1>
                        <p style="color: var(--text-secondary);">Manage users and track their progress</p>
                    </div>

                    <div class="dashboard-stats stagger-children">
                        <div class="stat-card">
                            <div class="stat-label">Total Users</div>
                            <div class="stat-value">${this.users.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Tasks</div>
                            <div class="stat-value">${totalTasks}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Completed</div>
                            <div class="stat-value">${completedTasks}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Completion Rate</div>
                            <div class="stat-value">${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</div>
                        </div>
                    </div>

                    <div class="admin-table">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Total Tasks</th>
                                        <th>Completed</th>
                                        <th>In Progress</th>
                                        <th>Pending</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.users.length === 0 ? `
                                        <tr>
                                            <td colspan="7" class="empty-state" style="padding: 3rem;">
                                                No users found
                                            </td>
                                        </tr>
                                    ` : this.users.map(user => `
                                        <tr>
                                            <td><strong>${user.username}</strong></td>
                                            <td>${user.email}</td>
                                            <td>${user.total_tasks}</td>
                                            <td><span class="badge badge-success">${user.completed_tasks}</span></td>
                                            <td><span class="badge badge-info">${user.in_progress_tasks}</span></td>
                                            <td><span class="badge badge-warning">${user.pending_tasks}</span></td>
                                            <td>
                                                <button class="btn btn-ghost btn-sm delete-user-btn" data-user-id="${user.id}" data-username="${user.username}">
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const appContainer = document.getElementById('app');
        const existingPage = appContainer.querySelector('.dashboard-page');
        if (existingPage) {
            existingPage.remove();
        }
        appContainer.insertAdjacentHTML('beforeend', html);
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.navbar.attachEventListeners();
        this.attachDeleteListeners();
    }

    async init() {
        await this.loadData();
        this.navbar.init();
    }
}