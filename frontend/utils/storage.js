// Storage Utility
const Storage = {
    keys: {
        TOKEN: 'authToken',
        USER: 'currentUser',
        THEME: 'theme',
        POMODOROS: 'pomodorosToday'
    },

    setToken(token) {
        localStorage.setItem(this.keys.TOKEN, token);
    },

    getToken() {
        return localStorage.getItem(this.keys.TOKEN);
    },

    setUser(user) {
        localStorage.setItem(this.keys.USER, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(this.keys.USER);
        return user ? JSON.parse(user) : null;
    },

    setTheme(theme) {
        localStorage.setItem(this.keys.THEME, theme);
    },

    getTheme() {
        return localStorage.getItem(this.keys.THEME) || 'dark';
    },

    setPomodoros(count) {
        const today = new Date().toDateString();
        localStorage.setItem(this.keys.POMODOROS, JSON.stringify({ date: today, count }));
    },

    getPomodoros() {
        const data = localStorage.getItem(this.keys.POMODOROS);
        if (!data) return 0;
        
        const { date, count } = JSON.parse(data);
        const today = new Date().toDateString();
        
        return date === today ? count : 0;
    },

    clear() {
        localStorage.removeItem(this.keys.TOKEN);
        localStorage.removeItem(this.keys.USER);
        localStorage.removeItem(this.keys.POMODOROS);
    },

    isAuthenticated() {
        return !!this.getToken() && !!this.getUser();
    }
};