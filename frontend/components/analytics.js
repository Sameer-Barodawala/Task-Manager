// Analytics Component
class Analytics {
    constructor(tasks) {
        this.tasks = tasks;
    }

    render() {
        const stats = Helpers.calculateStats(this.tasks);
        
        return `
            <div class="analytics-section">
                <h3>📊 Task Analytics</h3>
                <div class="grid grid-3">
                    <div class="card">
                        <h4>Productivity Score</h4>
                        <div style="font-size: 2rem; font-weight: 700; color: var(--accent-primary);">
                            ${stats.completionRate}%
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${stats.completionRate}%"></div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h4>Task Distribution</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                            <div>Pending: <strong>${stats.pending}</strong></div>
                            <div>In Progress: <strong>${stats.inProgress}</strong></div>
                            <div>Completed: <strong>${stats.completed}</strong></div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h4>This Week</h4>
                        <div style="font-size: 1.5rem; margin-top: 1rem;">
                            🔥 ${stats.completed} tasks completed
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}