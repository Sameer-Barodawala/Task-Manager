// Register Page
class RegisterPage {
    render() {
        return `
            <div class="auth-page page">
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <div class="auth-logo animate-float">✨</div>
                            <h1 class="auth-title">Join TaskFlow</h1>
                            <p class="auth-subtitle">Create your account and start organizing!</p>
                        </div>

                        <form id="registerForm">
                            <div class="form-group">
                                <label class="form-label">Username</label>
                                <input 
                                    type="text" 
                                    class="form-input" 
                                    id="registerUsername" 
                                    placeholder="Choose a username"
                                    required
                                    autocomplete="username"
                                    minlength="3"
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input 
                                    type="email" 
                                    class="form-input" 
                                    id="registerEmail" 
                                    placeholder="your.email@example.com"
                                    required
                                    autocomplete="email"
                                />
                            </div>

                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input 
                                    type="password" 
                                    class="form-input" 
                                    id="registerPassword" 
                                    placeholder="Create a strong password"
                                    required
                                    autocomplete="new-password"
                                    minlength="6"
                                />
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                                ✨ Create Account
                            </button>
                        </form>

                        <div class="auth-divider">
                            <span>or</span>
                        </div>

                        <p style="text-align: center; color: var(--text-secondary);">
                            Already have an account? 
                            <a href="#" id="showLogin" style="font-weight: 600; color: var(--accent-primary);">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }

        const loginLink = document.getElementById('showLogin');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.app.showPage('login');
            });
        }
    }

    async handleRegister() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            await API.register(username, email, password);
            
            Helpers.showNotification('Account created successfully! Please login. 🎉', 'success');
            
            setTimeout(() => {
                window.app.showPage('login');
            }, 1500);

        } catch (error) {
            Helpers.showNotification(error.message || 'Registration failed. Please try again.', 'error');
        }
    }
}