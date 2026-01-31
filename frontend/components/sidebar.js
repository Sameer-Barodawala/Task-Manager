// Sidebar Component
class Sidebar {
    render() {
        return `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h2 class="sidebar-logo">TaskFlow</h2>
                    <button class="btn-icon btn-ghost sidebar-close" id="closeSidebar">
                        <span>✕</span>
                    </button>
                </div>
                
                <nav class="sidebar-nav">
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Menu</div>
                        <div class="sidebar-item active">
                            <span>📊</span>
                            <span>Dashboard</span>
                        </div>
                        <div class="sidebar-item">
                            <span>📋</span>
                            <span>All Tasks</span>
                        </div>
                        <div class="sidebar-item">
                            <span>⏰</span>
                            <span>Timer</span>
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Categories</div>
                        <div class="sidebar-item">
                            <span>💼</span>
                            <span>Work</span>
                        </div>
                        <div class="sidebar-item">
                            <span>🏠</span>
                            <span>Personal</span>
                        </div>
                    </div>
                </nav>
            </aside>
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
        `;
    }

    attachEventListeners() {
        // Close button
        const closeBtn = document.getElementById('closeSidebar');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // Overlay click to close
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.close();
            });
        }
    }

    close() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}