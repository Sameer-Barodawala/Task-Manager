// API Utility
const API = {
    baseURL: window.CONFIG?.API_BASE_URL || 'http://localhost:3000/api',

    async request(endpoint, options = {}) {
        const token = Storage.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            console.log('API Request:', endpoint, options.method || 'GET');
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();
            
            console.log('API Response:', response.status, data);

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async register(username, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
    },

    // Tasks
    async getTasks() {
        return this.request('/tasks');
    },

    async createTask(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    },

    async updateTask(id, taskData) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    },

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    },

    // Admin
    async getUsers() {
        return this.request('/admin/users');
    },

    async getUserStats(id) {
        return this.request(`/admin/users/${id}/stats`);
    },

    async getProgress() {
        return this.request('/admin/progress');
    },

    async deleteUser(id) {
        return this.request(`/admin/users/${id}`, {
            method: 'DELETE'
        });
    }
};