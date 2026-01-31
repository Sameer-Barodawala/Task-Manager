// Task Card Component
class TaskCard {
    constructor(task) {
        this.task = task;
    }

    getPriorityColor() {
        const colors = {
            high: '#ff6b6b',
            medium: '#ffd93d',
            low: '#4ecdc4'
        };
        return colors[this.task.priority] || colors.medium;
    }

    getStatusEmoji() {
        const emojis = {
            pending: '⏳',
            in_progress: '🚀',
            completed: '✅'
        };
        return emojis[this.task.status] || '📝';
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `<span style="color: var(--danger);">Overdue</span>`;
        if (diffDays === 0) return `<span style="color: var(--warning);">Today</span>`;
        if (diffDays === 1) return `<span style="color: var(--warning);">Tomorrow</span>`;
        if (diffDays <= 7) return `<span style="color: var(--info);">In ${diffDays} days</span>`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    render() {
        const priorityColor = this.getPriorityColor();
        const statusEmoji = this.getStatusEmoji();
        
        return `
            <div class="card task-card hover-lift" data-task-id="${this.task.id}" style="border-left: 4px solid ${priorityColor};">
                <div class="card-header">
                    <div class="flex items-center gap-2">
                        <span style="font-size: 1.5rem;">${statusEmoji}</span>
                        <h3 class="card-title">${this.task.title}</h3>
                    </div>
                </div>

                ${this.task.description ? `
                    <p class="card-description">${this.task.description}</p>
                ` : ''}

                <div class="flex gap-2 flex-wrap" style="margin-bottom: 1rem;">
                    <span class="badge badge-${this.task.priority === 'high' ? 'primary' : this.task.priority === 'medium' ? 'warning' : 'info'}">
                        <span class="badge-dot"></span>
                        ${this.task.priority}
                    </span>
                    <span class="badge badge-${this.task.status === 'completed' ? 'success' : this.task.status === 'in_progress' ? 'info' : 'warning'}">
                        ${this.task.status.replace('_', ' ')}
                    </span>
                    ${this.task.category ? `
                        <span class="badge" style="background: rgba(255, 255, 255, 0.1);">
                            📁 ${this.task.category}
                        </span>
                    ` : ''}
                </div>

                ${this.task.due_date ? `
                    <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 1rem;">
                        📅 Due: ${this.formatDate(this.task.due_date)}
                    </div>
                ` : ''}

                ${this.task.time_spent ? `
                    <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 1rem;">
                        ⏱️ Time spent: ${this.formatTime(this.task.time_spent)}
                    </div>
                ` : ''}

                <div class="flex gap-2">
                    <button class="btn btn-secondary btn-sm flex-1 edit-task-btn" data-task-id="${this.task.id}">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-ghost btn-sm flex-1 start-timer-btn" data-task-id="${this.task.id}">
                        ▶️ Timer
                    </button>
                    <button class="btn-icon btn-ghost btn-sm delete-task-btn" data-task-id="${this.task.id}" style="color: var(--danger);">
                        <span>🗑️</span>
                    </button>
                </div>
            </div>
        `;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    static renderEmpty(message = 'No tasks found') {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>${message}</h3>
                <p>Create a new task to get started!</p>
            </div>
        `;
    }
}