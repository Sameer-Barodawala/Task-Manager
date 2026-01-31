// Task Modal Component
class TaskModal {
    constructor() {
        this.task = null;
        this.onSave = null;
    }

    render(task = null, onSave = null) {
        this.task = task;
        this.onSave = onSave;
        const isEdit = task !== null;

        return `
            <div class="modal-overlay" id="taskModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${isEdit ? '✏️ Edit Task' : '➕ Create New Task'}</h3>
                        <button class="modal-close" id="closeTaskModal">&times;</button>
                    </div>

                    <form id="taskForm">
                        <div class="form-group">
                            <label class="form-label">Task Title *</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                id="taskTitle" 
                                placeholder="Enter task title"
                                value="${task?.title || ''}"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea 
                                class="form-textarea" 
                                id="taskDescription" 
                                placeholder="Add task description..."
                            >${task?.description || ''}</textarea>
                        </div>

                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">Priority</label>
                                <select class="form-select" id="taskPriority">
                                    <option value="low" ${task?.priority === 'low' ? 'selected' : ''}>🟢 Low</option>
                                    <option value="medium" ${task?.priority === 'medium' || !task ? 'selected' : ''}>🟡 Medium</option>
                                    <option value="high" ${task?.priority === 'high' ? 'selected' : ''}>🔴 High</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="taskStatus">
                                    <option value="pending" ${task?.status === 'pending' || !task ? 'selected' : ''}>⏳ Pending</option>
                                    <option value="in_progress" ${task?.status === 'in_progress' ? 'selected' : ''}>🚀 In Progress</option>
                                    <option value="completed" ${task?.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">Category</label>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    id="taskCategory" 
                                    placeholder="e.g., Work, Personal"
                                    value="${task?.category || ''}"
                                    list="categorySuggestions"
                                />
                                <datalist id="categorySuggestions">
                                    <option value="Work">
                                    <option value="Personal">
                                    <option value="Health">
                                    <option value="Learning">
                                    <option value="Finance">
                                </datalist>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Due Date</label>
                                <input 
                                    type="date" 
                                    class="form-input" 
                                    id="taskDueDate"
                                    value="${task?.due_date || ''}"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Tags (comma separated)</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                id="taskTags" 
                                placeholder="urgent, client, review"
                                value="${task?.tags || ''}"
                            />
                        </div>

                        ${task ? `
                            <input type="hidden" id="taskId" value="${task.id}">
                        ` : ''}

                        <div class="flex gap-2" style="margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary flex-1">
                                ${isEdit ? '💾 Update Task' : '➕ Create Task'}
                            </button>
                            <button type="button" class="btn btn-ghost" id="cancelTaskModal">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Close modal
        const closeBtn = document.getElementById('closeTaskModal');
        const cancelBtn = document.getElementById('cancelTaskModal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        // Form submission
        const form = document.getElementById('taskForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });
        }

        // Close on outside click
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        }
    }

    async handleSubmit() {
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value,
            category: document.getElementById('taskCategory').value,
            due_date: document.getElementById('taskDueDate').value,
            tags: document.getElementById('taskTags').value
        };

        const taskId = document.getElementById('taskId')?.value;

        try {
            let result;
            if (taskId) {
                result = await API.updateTask(taskId, taskData);
                Helpers.showNotification('Task updated successfully! ✅', 'success');
            } else {
                result = await API.createTask(taskData);
                Helpers.showNotification('Task created successfully! 🎉', 'success');
            }

            // Call the callback to refresh the task list
            if (this.onSave) {
                await this.onSave();
            }
            
            this.close();
        } catch (error) {
            console.error('Save task error:', error);
            Helpers.showNotification(error.message || 'Failed to save task. Please try again.', 'error');
        }
    }

    open(task = null, onSave = null) {
        const existingModal = document.getElementById('taskModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', this.render(task, onSave));
        this.attachEventListeners();
        
        setTimeout(() => {
            const modal = document.getElementById('taskModal');
            if (modal) {
                modal.classList.add('active');
                document.getElementById('taskTitle')?.focus();
            }
        }, 10);
    }

    close() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}