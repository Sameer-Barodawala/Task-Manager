// Dashboard Page
class DashboardPage {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.currentFilter = { status: 'all', priority: 'all', search: '' };
        this.navbar = new Navbar();
        this.sidebar = new Sidebar(); 
        this.taskModal = new TaskModal();
        this.taskTimer = new TaskTimer();
    }

    async loadTasks() {
        try {
            this.tasks = await API.getTasks();
            this.applyFilters();
            this.updateDisplay();
        } catch (error) {
            console.error('Load tasks error:', error);
            Helpers.showNotification('Failed to load tasks', 'error');
        }
    }

    updateDisplay() {
        const user = Storage.getUser();
        const stats = Helpers.calculateStats(this.tasks);
        const groupedTasks = Helpers.groupTasksByStatus(this.filteredTasks);

        // Update stats
        const statsContainer = document.querySelector('.dashboard-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-label">Total Tasks</div>
                    <div class="stat-value">${stats.total}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">In Progress</div>
                    <div class="stat-value">${stats.inProgress}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value">${stats.completed}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Completion Rate</div>
                    <div class="stat-value">${stats.completionRate}%</div>
                </div>
            `;
        }

        // Update tasks sections
        let tasksHTML = '';

        if (groupedTasks.in_progress.length > 0) {
            tasksHTML += `
                <div class="tasks-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            🚀 In Progress
                            <span class="section-count">${groupedTasks.in_progress.length}</span>
                        </h2>
                    </div>
                    <div class="grid grid-2">
                        ${groupedTasks.in_progress.map(task => new TaskCard(task).render()).join('')}
                    </div>
                </div>
            `;
        }

        if (groupedTasks.pending.length > 0) {
            tasksHTML += `
                <div class="tasks-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            ⏳ Pending
                            <span class="section-count">${groupedTasks.pending.length}</span>
                        </h2>
                    </div>
                    <div class="grid grid-2">
                        ${groupedTasks.pending.map(task => new TaskCard(task).render()).join('')}
                    </div>
                </div>
            `;
        }

        if (groupedTasks.completed.length > 0) {
            tasksHTML += `
                <div class="tasks-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            ✅ Completed
                            <span class="section-count">${groupedTasks.completed.length}</span>
                        </h2>
                    </div>
                    <div class="grid grid-2">
                        ${groupedTasks.completed.map(task => new TaskCard(task).render()).join('')}
                    </div>
                </div>
            `;
        }

        if (this.filteredTasks.length === 0) {
            tasksHTML = TaskCard.renderEmpty();
        }

        // Find tasks container
        let tasksContainer = document.querySelector('.tasks-sections-container');
        if (!tasksContainer) {
            // Create container if it doesn't exist
            const container = document.querySelector('.dashboard-page .container');
            const filtersDiv = container.querySelector('.filters');
            tasksContainer = document.createElement('div');
            tasksContainer.className = 'tasks-sections-container';
            filtersDiv.after(tasksContainer);
        }
        
        tasksContainer.innerHTML = tasksHTML;

        // Re-attach event listeners for task cards
        this.attachTaskCardListeners();
    }

    applyFilters() {
        this.filteredTasks = Helpers.filterTasks(this.tasks, this.currentFilter);
    }

    render() {
        const user = Storage.getUser();
        const stats = Helpers.calculateStats(this.tasks);
        const groupedTasks = Helpers.groupTasksByStatus(this.filteredTasks);

        const html = `
            <div class="dashboard-page page">
                ${this.navbar.render(user)}
                ${this.sidebar.render()} 
                <div class="container">
                    <div class="dashboard-header">
                        <div class="dashboard-title-section">
                            <div>
                                <h1 class="dashboard-greeting">${Helpers.getGreeting()}, ${user.username}! 👋</h1>
                                <p class="dashboard-date">${Helpers.getCurrentDate()}</p>
                            </div>
                            <button class="btn btn-primary" id="createTaskBtn">
                                ➕ New Task
                            </button>
                        </div>

                        <div class="dashboard-stats stagger-children">
                            <div class="stat-card">
                                <div class="stat-label">Total Tasks</div>
                                <div class="stat-value">${stats.total}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">In Progress</div>
                                <div class="stat-value">${stats.inProgress}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">Completed</div>
                                <div class="stat-value">${stats.completed}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-label">Completion Rate</div>
                                <div class="stat-value">${stats.completionRate}%</div>
                            </div>
                        </div>
                    </div>

                    <div class="filters">
                        <select class="form-select" id="statusFilter" style="width: auto;">
                            <option value="all">All Status</option>
                            <option value="pending">⏳ Pending</option>
                            <option value="in_progress">🚀 In Progress</option>
                            <option value="completed">✅ Completed</option>
                        </select>

                        <select class="form-select" id="priorityFilter" style="width: auto;">
                            <option value="all">All Priorities</option>
                            <option value="high">🔴 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                        </select>

                        <div class="search-container flex-1">
                            <span class="search-icon">🔍</span>
                            <input 
                                type="text" 
                                class="search-input" 
                                id="taskSearch" 
                                placeholder="Search tasks..."
                            />
                        </div>
                    </div>

                    <div class="tasks-sections-container">
                        ${this.renderTaskSections(groupedTasks)}
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
        
       
    }

    renderTaskSections(groupedTasks) {
        let html = '';

        if (groupedTasks.in_progress.length > 0) {
            html += `
                <div class="tasks-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            🚀 In Progress
                            <span class="section-count">${groupedTasks.in_progress.length}</span>
                        </h2>
                    </div>
                    <div class="grid grid-2">
                        ${groupedTasks.in_progress.map(task => new TaskCard(task).render()).join('')}
                    </div>
                </div>
            `;
        }

        if (groupedTasks.pending.length > 0) {
            html += `
                <div class="tasks-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            ⏳ Pending
                            <span class="section-count">${groupedTasks.pending.length}</span>
                        </h2>
                    </div>
                    <div class="grid grid-2">
                        ${groupedTasks.pending.map(task => new TaskCard(task).render()).join('')}
                    </div>
                </div>
            `;
        }

        if (groupedTasks.completed.length > 0) {
            html += `
                <div class="tasks-section">
                    <div class="section-header">
                        <h2 class="section-title">
                            ✅ Completed
                            <span class="section-count">${groupedTasks.completed.length}</span>
                        </h2>
                    </div>
                    <div class="grid grid-2">
                        ${groupedTasks.completed.map(task => new TaskCard(task).render()).join('')}
                    </div>
                </div>
            `;
        }

        if (this.filteredTasks.length === 0) {
            html = TaskCard.renderEmpty();
        }

        return html;
    }

    attachEventListeners() {
        this.navbar.init();
        this.navbar.attachEventListeners();
        this.sidebar.attachEventListeners(); 

        // Create task button
        const createBtn = document.getElementById('createTaskBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.taskModal.open(null, () => this.loadTasks());
            });
        }

        // Filter listeners
        const statusFilter = document.getElementById('statusFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        const searchInput = document.getElementById('taskSearch');

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilter.status = e.target.value;
                this.applyFilters();
                this.updateDisplay();
            });
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => {
                this.currentFilter.priority = e.target.value;
                this.applyFilters();
                this.updateDisplay();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', Helpers.debounce((e) => {
                this.currentFilter.search = e.target.value;
                this.applyFilters();
                this.updateDisplay();
            }, 300));
        }

        // Attach task card listeners
        this.attachTaskCardListeners();

        // Global search handler
        window.handleGlobalSearch = Helpers.debounce((query) => {
            this.currentFilter.search = query;
            this.applyFilters();
            this.updateDisplay();
        }, 300);
    }

    attachTaskCardListeners() {
        // Task action buttons
        document.querySelectorAll('.edit-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.currentTarget.dataset.taskId);
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    this.taskModal.open(task, () => this.loadTasks());
                }
            });
        });

        document.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = parseInt(e.currentTarget.dataset.taskId);
                if (confirm('Are you sure you want to delete this task?')) {
                    try {
                        await API.deleteTask(taskId);
                        Helpers.showNotification('Task deleted successfully! 🗑️', 'success');
                        await this.loadTasks();
                    } catch (error) {
                        console.error('Delete task error:', error);
                        Helpers.showNotification('Failed to delete task', 'error');
                    }
                }
            });
        });

        document.querySelectorAll('.start-timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.currentTarget.dataset.taskId);
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    this.taskTimer.open(task);
                }
            });
        });
    }

    async init() {
        await this.loadTasks();
        
    }
}