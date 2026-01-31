// Main Application
class App {
    constructor() {
        this.pages = {
            login: new LoginPage(),
            register: new RegisterPage(),
            dashboard: new DashboardPage(),
            admin: new AdminPage()
        };
        
        this.currentPage = null;
    }

    init() {
        // Check authentication
        if (Storage.isAuthenticated()) {
            const user = Storage.getUser();
            if (user.role === 'admin') {
                this.showPage('admin');
            } else {
                this.showPage('dashboard');
            }
        } else {
            this.showPage('login');
        }

        // Initialize theme
        this.initTheme();
    }

    initTheme() {
        const savedTheme = Storage.getTheme();
        document.body.setAttribute('data-theme', savedTheme);
    }

    showPage(pageName) {
        // Remove all existing pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            setTimeout(() => {
                if (!page.classList.contains('active')) {
                    page.remove();
                }
            }, 300);
        });

        // Show new page
        const page = this.pages[pageName];
        if (page) {
            this.currentPage = pageName;
            
            // Render page
            const appContainer = document.getElementById('app');
            appContainer.insertAdjacentHTML('beforeend', page.render());
            
            // Attach event listeners
            page.attachEventListeners();
            
            // Initialize page (load data)
            if (page.init) {
                page.init();
            }
            
            // Activate page
            setTimeout(() => {
                const pageElement = appContainer.querySelector('.page:last-child');
                if (pageElement) {
                    pageElement.classList.add('active');
                }
            }, 10);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});