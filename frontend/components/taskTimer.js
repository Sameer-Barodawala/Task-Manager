// Task Timer Component (Pomodoro Style)
class TaskTimer {
    constructor() {
        this.currentTask = null;
        this.isRunning = false;
        this.seconds = 0;
        this.interval = null;
        this.mode = 'work'; // work, shortBreak, longBreak
        this.workDuration = 25 * 60; // 25 minutes
        this.shortBreakDuration = 5 * 60; // 5 minutes
        this.longBreakDuration = 15 * 60; // 15 minutes
        this.pomodorosCompleted = 0;
    }

    render(task = null) {
        this.currentTask = task;
        
        const duration = this.mode === 'work' ? this.workDuration : 
                        this.mode === 'shortBreak' ? this.shortBreakDuration : 
                        this.longBreakDuration;
        
        const totalSeconds = this.seconds || duration;
        const progress = ((duration - totalSeconds) / duration) * 100;

        return `
            <div class="modal-overlay" id="timerModal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3>⏱️ Focus Timer</h3>
                        <button class="modal-close" id="closeTimer">&times;</button>
                    </div>

                    ${task ? `
                        <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                            <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">
                                Current Task
                            </div>
                            <div style="font-weight: 600; font-size: 1.1rem;">
                                ${task.title}
                            </div>
                        </div>
                    ` : ''}

                    <div class="tabs" style="margin-bottom: 2rem;">
                        <button class="tab ${this.mode === 'work' ? 'active' : ''}" data-mode="work">
                            Work (25m)
                        </button>
                        <button class="tab ${this.mode === 'shortBreak' ? 'active' : ''}" data-mode="shortBreak">
                            Short Break (5m)
                        </button>
                        <button class="tab ${this.mode === 'longBreak' ? 'active' : ''}" data-mode="longBreak">
                            Long Break (15m)
                        </button>
                    </div>

                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="position: relative; width: 250px; height: 250px; margin: 0 auto;">
                            <svg width="250" height="250" style="transform: rotate(-90deg);">
                                <circle cx="125" cy="125" r="110" fill="none" stroke="var(--bg-tertiary)" stroke-width="20"/>
                                <circle 
                                    cx="125" 
                                    cy="125" 
                                    r="110" 
                                    fill="none" 
                                    stroke="url(#timerGradient)" 
                                    stroke-width="20"
                                    stroke-dasharray="${2 * Math.PI * 110}"
                                    stroke-dashoffset="${2 * Math.PI * 110 * (1 - progress / 100)}"
                                    stroke-linecap="round"
                                    style="transition: stroke-dashoffset 1s linear;"
                                />
                                <defs>
                                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color: var(--accent-primary);" />
                                        <stop offset="100%" style="stop-color: var(--accent-secondary);" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                                <div id="timerDisplay" style="font-size: 3.5rem; font-weight: 800; font-family: var(--font-display); line-height: 1;">
                                    ${this.formatTime(totalSeconds)}
                                </div>
                                <div style="font-size: 0.9rem; color: var(--text-tertiary); margin-top: 0.5rem;">
                                    ${this.mode === 'work' ? 'Focus Time' : 'Break Time'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">
                            Pomodoros Completed Today
                        </div>
                        <div style="display: flex; justify-content: center; gap: 0.5rem;">
                            ${Array(Math.min(this.pomodorosCompleted, 8)).fill('🍅').join('')}
                            <span style="color: var(--text-tertiary);">${this.pomodorosCompleted > 0 ? this.pomodorosCompleted : ''}</span>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button class="btn btn-primary flex-1" id="toggleTimer">
                            ${this.isRunning ? '⏸️ Pause' : '▶️ Start'}
                        </button>
                        <button class="btn btn-ghost" id="resetTimer">
                            🔄 Reset
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    attachEventListeners() {
        // Close modal
        const closeBtn = document.getElementById('closeTimer');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Toggle timer
        const toggleBtn = document.getElementById('toggleTimer');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Reset timer
        const resetBtn = document.getElementById('resetTimer');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        // Mode tabs
        const tabs = document.querySelectorAll('.tab[data-mode]');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                if (!this.isRunning) {
                    this.changeMode(mode);
                }
            });
        });
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        this.isRunning = true;
        
        if (this.seconds === 0) {
            this.seconds = this.mode === 'work' ? this.workDuration :
                          this.mode === 'shortBreak' ? this.shortBreakDuration :
                          this.longBreakDuration;
        }

        this.interval = setInterval(() => {
            this.seconds--;
            this.updateDisplay();

            if (this.seconds === 0) {
                this.complete();
            }
        }, 1000);

        this.updateDisplay();
    }

    pause() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.updateDisplay();
    }

    reset() {
        this.pause();
        this.seconds = 0;
        this.updateDisplay();
    }

    complete() {
        this.pause();
        
        if (this.mode === 'work') {
            this.pomodorosCompleted++;
            Helpers.showNotification('Work session complete! Take a break. 🎉', 'success');
            
            // Auto-switch to break
            if (this.pomodorosCompleted % 4 === 0) {
                this.changeMode('longBreak');
            } else {
                this.changeMode('shortBreak');
            }
        } else {
            Helpers.showNotification('Break complete! Ready to focus? 💪', 'info');
            this.changeMode('work');
        }

        // Play notification sound (if browser supports)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('TaskFlow Timer', {
                body: this.mode === 'work' ? 'Time for a break!' : 'Time to focus!',
                icon: '⏰'
            });
        }
    }

    changeMode(mode) {
        this.mode = mode;
        this.seconds = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        const modal = document.getElementById('timerModal');
        if (modal && modal.classList.contains('active')) {
            const timerDisplay = document.getElementById('timerDisplay');
            const toggleBtn = document.getElementById('toggleTimer');
            
            const duration = this.mode === 'work' ? this.workDuration :
                           this.mode === 'shortBreak' ? this.shortBreakDuration :
                           this.longBreakDuration;
            
            const totalSeconds = this.seconds || duration;
            
            if (timerDisplay) {
                timerDisplay.textContent = this.formatTime(totalSeconds);
            }
            
            if (toggleBtn) {
                toggleBtn.innerHTML = this.isRunning ? '⏸️ Pause' : '▶️ Start';
            }

            // Update progress circle
            const progress = ((duration - totalSeconds) / duration) * 100;
            const circle = document.querySelector('circle[stroke="url(#timerGradient)"]');
            if (circle) {
                const circumference = 2 * Math.PI * 110;
                circle.style.strokeDashoffset = circumference * (1 - progress / 100);
            }
        }
    }

    open(task = null) {
        const modal = document.getElementById('timerModal');
        if (!modal) {
            document.body.insertAdjacentHTML('beforeend', this.render(task));
            this.attachEventListeners();
        } else {
            modal.classList.add('active');
        }

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    close() {
        this.pause();
        const modal = document.getElementById('timerModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
}