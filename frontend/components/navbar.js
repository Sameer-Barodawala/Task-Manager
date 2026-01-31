// Navbar Component
class Navbar {
    constructor() {
        this.currentUser = null;
    }

    render(user) {
        this.currentUser = user;
        
        return `
            <nav class="navbar">
                <div class="container navbar-content">
                    <div class="flex items-center gap-3">
                        <button class="btn-icon btn-ghost" id="toggleSidebar">
                            <span>☰</span>
                        </button>
                        <div class="navbar-brand">
                            <span class="gradient-animate" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                TaskFlow
                            </span>
                        </div>
                    </div>
                    
                    <div class="navbar-actions">
                        <div class="search-container" style="max-width: 300px;">
                            <span class="search-icon">🔍</span>
                            <input 
                                type="text" 
                                class="search-input" 
                                placeholder="Search tasks..." 
                                id="globalSearch"
                            />
                        </div>
                        
                        <button class="btn-icon btn-ghost" id="toggleTheme" title="Toggle Theme">
                            <span id="themeIcon">🌙</span>
                        </button>
                        
                        <div class="navbar-user">
                            <div class="navbar-avatar">
                                ${user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style="font-weight: 600; font-size: 0.9rem;">${user.username}</div>
                                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${user.role}</div>
                            </div>
                        </div>
                        
                        <button class="btn btn-secondary btn-sm" id="logoutBtn">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    attachEventListeners() {
        // Toggle sidebar
        const toggleBtn = document.getElementById('toggleSidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('active');
                }
                if (overlay) {  
                overlay.classList.toggle('active');
            }
            });
        }

        // Theme toggle
        const themeBtn = document.getElementById('toggleTheme');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const body = document.body;
                const currentTheme = body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                body.setAttribute('data-theme', newTheme);
                
                // Update icon
                const themeIcon = document.getElementById('themeIcon');
                if (themeIcon) {
                    themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
                }
                
                // Save preference
                localStorage.setItem('theme', newTheme);
                
                console.log('Theme changed to:', newTheme);
            });
        }

        // Global search
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (window.handleGlobalSearch) {
                    window.handleGlobalSearch(query);
                }
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    Storage.clear();
                    window.location.reload();
                }
            });
        }
    }

    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
        }
    }
}