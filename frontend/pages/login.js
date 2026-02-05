// Login Page
class LoginPage {
    render() {
        return `
            <div class="auth-page page animate-fadeIn">
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <div class="auth-logo animate-float">⚡</div>
                            <h1 class="auth-title">TaskFlow</h1>
                            <p class="auth-subtitle">Welcome back! Let's get productive.</p>
                        </div>

                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label">Username</label>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    id="loginUsername" 
                                    placeholder="Enter your username"
                                    required
                                    autocomplete="username"
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <div class="password-input-wrapper">
                                    <input 
                                        type="password" 
                                        class="form-input" 
                                        id="loginPassword" 
                                        placeholder="Enter your password"
                                        required
                                        autocomplete="current-password"
                                    />
                                    <button type="button" class="password-toggle" id="toggleLoginPassword">
                                        <span class="eye-icon">👁️</span>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                                🚀 Login
                            </button>
                        </form>

                        <div class="auth-divider">
                            <span>or</span>
                        </div>

                        <p style="text-align: center; color: var(--text-secondary);">
                            Don't have an account? 
                            <a href="#" id="showRegister" style="font-weight: 600; color: var(--accent-primary);">
                                Create one
                            </a>
                        </p>

                        <div style="margin-top: 2rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md); font-size: 0.85rem;">
                            <strong>Demo Credentials:</strong><br>
                            Admin: admin / admin123<br>
                            User: demo / demo123
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        const registerLink = document.getElementById('showRegister');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.app.showPage('register');
            });
        }

        // Password visibility toggle
        const togglePassword = document.getElementById('toggleLoginPassword');
        const passwordInput = document.getElementById('loginPassword');
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                
                const eyeIcon = togglePassword.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
                }
            });
        }
    }

    async handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Attempting login with username:', username);

        try {
            const data = await API.login(username, password);
            
            console.log('Login successful:', data);
            
            Storage.setToken(data.token);
            Storage.setUser(data.user);

            Helpers.showNotification(`Welcome back, ${data.user.username}! 👋`, 'success');

            console.log('User role:', data.user.role);

            // Redirect based on role
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    console.log('Redirecting to admin page');
                    window.app.showPage('admin');
                } else {
                    console.log('Redirecting to dashboard page');
                    window.app.showPage('dashboard');
                }
            }, 500);

        } catch (error) {
            console.error('Login error:', error);
            Helpers.showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
        }
    }
}