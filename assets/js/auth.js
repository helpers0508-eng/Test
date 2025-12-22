// Authentication Module
// Handles login, OTP verification, and session management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionToken = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
    }

    checkExistingSession() {
        // Check for stored session token
        const token = localStorage.getItem('sessionToken');
        const user = localStorage.getItem('currentUser');

        if (token && user) {
            this.sessionToken = token;
            this.currentUser = JSON.parse(user);
            this.redirectToDashboard();
        }
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form submission
        const signupForm = document.querySelector('#signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // OTP verification
        const otpForm = document.querySelector('#otp-form');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => this.handleOTPVerification(e));
        }

        // Logout
        const logoutBtn = document.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            // Simulate API call
            const response = await this.loginAPI(credentials);
            if (response.success) {
                this.setSession(response.user, response.token);
                this.redirectToDashboard();
            } else {
                UIManager.showToast('Login failed: ' + response.message, 'error');
            }
        } catch (error) {
            UIManager.showToast('Login error: ' + error.message, 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        if (userData.password !== userData.confirmPassword) {
            UIManager.showToast('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await this.signupAPI(userData);
            if (response.success) {
                UIManager.showToast('Account created successfully! Please verify your email.', 'success');
                // Redirect to OTP page or login
                window.location.href = '/verify-otp';
            } else {
                UIManager.showToast('Signup failed: ' + response.message, 'error');
            }
        } catch (error) {
            UIManager.showToast('Signup error: ' + error.message, 'error');
        }
    }

    async handleOTPVerification(e) {
        e.preventDefault();
        const otp = document.querySelector('#otp-input').value;

        try {
            const response = await this.verifyOTPAPI(otp);
            if (response.success) {
                this.setSession(response.user, response.token);
                this.redirectToDashboard();
            } else {
                UIManager.showToast('OTP verification failed', 'error');
            }
        } catch (error) {
            UIManager.showToast('OTP error: ' + error.message, 'error');
        }
    }

    setSession(user, token) {
        this.currentUser = user;
        this.sessionToken = token;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('sessionToken', token);
    }

    logout() {
        this.currentUser = null;
        this.sessionToken = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionToken');
        window.location.href = '/login';
    }

    redirectToDashboard() {
        if (!this.currentUser) return;

        const role = this.currentUser.role;
        switch (role) {
            case 'user':
                window.location.href = '/dashboard';
                break;
            case 'helper':
                window.location.href = '/helper/dashboard';
                break;
            case 'admin':
                window.location.href = '/admin/dashboard';
                break;
            default:
                window.location.href = '/';
        }
    }

    // API methods using mock data
    async loginAPI(credentials) {
        try {
            const response = await fetch('/assets/mock/users.json');
            const data = await response.json();
            const user = data.users.find(u => u.email === credentials.email && u.password === credentials.password);

            if (user) {
                const session = data.sessions.find(s => s.userId === user.id);
                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name
                    },
                    token: session ? session.token : 'mock-token'
                };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('Login API error:', error);
            return { success: false, message: 'Login failed' };
        }
    }

    async signupAPI(userData) {
        try {
            // In a real app, this would create a new user
            // For mock, just return success
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Account created' };
        } catch (error) {
            return { success: false, message: 'Signup failed' };
        }
    }

    async verifyOTPAPI(otp) {
        try {
            // Mock OTP verification
            await new Promise(resolve => setTimeout(resolve, 500));
            if (otp === '123456') {
                const response = await fetch('/assets/mock/users.json');
                const data = await response.json();
                const user = data.users[0]; // Return first user for demo
                const session = data.sessions.find(s => s.userId === user.id);
                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name
                    },
                    token: session ? session.token : 'mock-token'
                };
            }
            return { success: false, message: 'Invalid OTP' };
        } catch (error) {
            return { success: false, message: 'OTP verification failed' };
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});