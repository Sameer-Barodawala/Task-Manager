// Helper Utilities
const Helpers = {
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const id = `notif-${Date.now()}`;
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.id = id;
        notification.innerHTML = `
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--text-primary); cursor: pointer; font-size: 1.2rem;">&times;</button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            const notif = document.getElementById(id);
            if (notif) {
                notif.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notif.remove(), 300);
            }
        }, 5000);
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getRelativeTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < -7) return this.formatDate(dateString);
        if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
        if (diffDays === -1) return 'Yesterday';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays <= 7) return `In ${diffDays} days`;
        return this.formatDate(dateString);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    filterTasks(tasks, filters) {
        let filtered = [...tasks];

        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(task => task.status === filters.status);
        }

        if (filters.priority && filters.priority !== 'all') {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(task => task.category === filters.category);
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(search) ||
                (task.description && task.description.toLowerCase().includes(search))
            );
        }

        return filtered;
    },

    sortTasks(tasks, sortBy = 'created_at', order = 'desc') {
        return [...tasks].sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            // Handle dates
            if (sortBy === 'created_at' || sortBy === 'updated_at' || sortBy === 'due_date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            // Handle priority
            if (sortBy === 'priority') {
                const priorities = { high: 3, medium: 2, low: 1 };
                aVal = priorities[aVal] || 0;
                bVal = priorities[bVal] || 0;
            }

            if (order === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    },

    groupTasksByStatus(tasks) {
        return {
            pending: tasks.filter(t => t.status === 'pending'),
            in_progress: tasks.filter(t => t.status === 'in_progress'),
            completed: tasks.filter(t => t.status === 'completed')
        };
    },

    calculateStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in_progress').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            pending,
            completionRate
        };
    },

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    },

    getCurrentDate() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    exportToCSV(data, filename) {
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }
};