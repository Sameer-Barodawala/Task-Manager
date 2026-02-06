// Loading Screen Component
class LoadingScreen {
    constructor() {
        this.maxRetries = 30; // 30 retries = ~60 seconds (2 sec intervals)
        this.retryCount = 0;
        this.checkInterval = 2000; // Check every 2 seconds
        this.isShown = false;
    }

    render() {
        return `
            <div id="loadingScreen" class="loading-screen active">
                <div class="loading-container">
                    <!-- Animated Logo -->
                    <div class="loading-logo">
                        <div class="logo-circle">
                            <span class="logo-icon">⚡</span>
                        </div>
                        <div class="pulse-ring"></div>
                        <div class="pulse-ring-2"></div>
                    </div>

                    <!-- App Name -->
                    <h1 class="loading-title">TaskFlow</h1>
                    
                    <!-- Loading Message -->
                    <div class="loading-message" id="loadingMessage">
                        Connecting to server...
                    </div>

                    <!-- Progress Bar -->
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="progress-text" id="progressText">Initializing...</div>
                    </div>

                    <!-- Fun Facts -->
                    <div class="loading-tips" id="loadingTips">
                        <p>💡 Did you know? You can use the Pomodoro timer to stay focused!</p>
                    </div>

                    <!-- Retry Button (shown after failures) -->
                    <button class="btn btn-primary" id="retryBtn" style="display: none; margin-top: 2rem;">
                        🔄 Retry Connection
                    </button>
                </div>

                <!-- Particle Animation Background -->
                <div class="particles">
                    ${Array(20).fill(0).map((_, i) => `<div class="particle" style="--delay: ${i * 0.2}s; --x: ${Math.random() * 100}%; --y: ${Math.random() * 100}%;"></div>`).join('')}
                </div>
            </div>
        `;
    }

    getApiBaseUrl() {
        // Try to get API URL from config or API object
        if (typeof API_BASE_URL !== 'undefined') {
            return API_BASE_URL;
        }
        if (typeof API !== 'undefined' && API.baseURL) {
            return API.baseURL;
        }
        // Fallback to localhost
        return 'http://localhost:3000/api';
    }

    async checkBackend() {
        const messages = [
            "Waking up the server... ☕",
            "This might take a moment on free hosting... ⏰",
            "Loading your workspace... 📦",
            "Almost there... 🚀",
            "Setting up your tasks... 📋",
            "Preparing the dashboard... 📊",
            "Getting everything ready... ⚙️",
            "Still working on it... 💪",
            "Thanks for your patience... 😊",
            "Just a few more seconds... ⏳"
        ];

        const tips = [
            "💡 Tip: Use categories to organize your tasks by project!",
            "⚡ Tip: The Pomodoro timer helps you stay focused for 25 minutes!",
            "🎯 Tip: Set priorities to tackle important tasks first!",
            "📅 Tip: Add due dates to never miss a deadline!",
            "🏷️ Tip: Use tags to quickly find related tasks!",
            "✨ Tip: Try the dark mode toggle in the navbar!",
            "🚀 Tip: Mark tasks as 'In Progress' when you start working!",
            "📈 Tip: Check your completion rate in the dashboard stats!",
            "🎨 Tip: Color-coded badges show priority at a glance!",
            "⏱️ Tip: Track time spent on tasks with the timer feature!"
        ];

        this.retryCount = 0;
        let tipIndex = 0;

        const checkConnection = async () => {
            try {
                const messageEl = document.getElementById('loadingMessage');
                const progressEl = document.getElementById('progressFill');
                const progressTextEl = document.getElementById('progressText');
                const tipsEl = document.getElementById('loadingTips');

                // Update message
                const messageIndex = Math.min(this.retryCount, messages.length - 1);
                if (messageEl) {
                    messageEl.textContent = messages[messageIndex];
                }

                // Update progress
                const progress = Math.min((this.retryCount / this.maxRetries) * 100, 95);
                if (progressEl) {
                    progressEl.style.width = `${progress}%`;
                }
                if (progressTextEl) {
                    progressTextEl.textContent = `${Math.round(progress)}% - Attempt ${this.retryCount + 1}/${this.maxRetries}`;
                }

                // Rotate tips
                if (tipsEl && this.retryCount % 3 === 0) {
                    tipsEl.innerHTML = `<p>${tips[tipIndex % tips.length]}</p>`;
                    tipIndex++;
                }

                console.log(`Loading: Checking backend (attempt ${this.retryCount + 1}/${this.maxRetries})`);

                const apiUrl = this.getApiBaseUrl();
                console.log('API URL:', apiUrl);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const response = await fetch(`${apiUrl}/health`, {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Backend connected successfully:', data);

                    // Success animation
                    if (progressEl) {
                        progressEl.style.width = '100%';
                    }
                    if (messageEl) {
                        messageEl.textContent = '✅ Connected! Loading application...';
                    }
                    if (progressTextEl) {
                        progressTextEl.textContent = '100% - Ready!';
                    }

                    // Wait a moment to show success
                    await new Promise(resolve => setTimeout(resolve, 500));

                    return true;
                } else {
                    throw new Error('Backend not ready');
                }

            } catch (error) {
                console.log('Backend check failed:', error.message);

                this.retryCount++;

                if (this.retryCount >= this.maxRetries) {
                    this.showError();
                    return false;
                }

                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, this.checkInterval));
                return checkConnection();
            }
        };

        const success = await checkConnection();
        
        if (success) {
            this.hide();
        }

        return success;
    }

    showError() {
        const messageEl = document.getElementById('loadingMessage');
        const progressTextEl = document.getElementById('progressText');
        const retryBtn = document.getElementById('retryBtn');
        const tipsEl = document.getElementById('loadingTips');

        if (messageEl) {
            messageEl.innerHTML = '❌ Unable to connect to server';
            messageEl.style.color = 'var(--danger)';
        }
        if (progressTextEl) {
            progressTextEl.textContent = 'Connection timeout';
        }
        if (retryBtn) {
            retryBtn.style.display = 'block';
            retryBtn.onclick = () => {
                retryBtn.style.display = 'none';
                this.retryCount = 0;
                
                // Reset UI
                const messageEl = document.getElementById('loadingMessage');
                if (messageEl) {
                    messageEl.style.color = '';
                }
                
                this.checkBackend();
            };
        }
        if (tipsEl) {
            tipsEl.innerHTML = `
                <p style="color: var(--danger);">
                    ⚠️ The server might be sleeping (free hosting).<br>
                    Please wait a moment and try again.
                </p>
            `;
        }
    }

    show() {
        if (this.isShown) return;
        
        const existingScreen = document.getElementById('loadingScreen');
        if (!existingScreen) {
            document.body.insertAdjacentHTML('afterbegin', this.render());
        }
        const screen = document.getElementById('loadingScreen');
        if (screen) {
            screen.classList.add('active');
            this.isShown = true;
        }
    }

    hide() {
        const screen = document.getElementById('loadingScreen');
        if (screen) {
            screen.classList.add('fade-out');
            setTimeout(() => {
                screen.remove();
                this.isShown = false;
            }, 500);
        }
    }

    async init() {
        console.log('Loading screen initialized');
        this.show();
        await this.checkBackend();
    }
}

// Initialize loading screen immediately when script loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, showing loading screen');
        const loadingScreen = new LoadingScreen();
        loadingScreen.show();
    });
}