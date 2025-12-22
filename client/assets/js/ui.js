// UI Module
// Handles modals, toasts, dark mode, and general UI interactions

class UIManager {
    constructor() {
        this.toastContainer = null;
        this.modalContainer = null;
        this.init();
    }

    init() {
        this.createContainers();
        this.setupDarkMode();
        this.setupMobileMenu();
        this.setupScrollEffects();
    }

    createContainers() {
        // Create toast container
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.toastContainer);

        // Create modal container
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'modal-container';
        this.modalContainer.className = 'fixed inset-0 z-40 hidden';
        document.body.appendChild(this.modalContainer);
    }

    setupDarkMode() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        // Theme toggle button
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);

        // Update toggle button icon
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('span');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        }
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
        const mobileMenu = document.querySelector('#mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }

    setupScrollEffects() {
        // Navbar background on scroll
        const navbar = document.querySelector('header');
        if (navbar) {
            globalThis.addEventListener('scroll', () => {
                if (globalThis.scrollY > 50) {
                    navbar.classList.add('bg-white/95', 'backdrop-blur-sm', 'shadow-sm');
                    navbar.classList.remove('bg-transparent');
                } else {
                    navbar.classList.remove('bg-white/95', 'backdrop-blur-sm', 'shadow-sm');
                    navbar.classList.add('bg-transparent');
                }
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast p-4 rounded-lg shadow-lg max-w-sm ${this.getToastClasses(type)} transform translate-x-full transition-transform duration-300`;

        toast.innerHTML = `
            <div class="flex items-center">
                <span class="material-symbols-outlined text-lg mr-3">${this.getToastIcon(type)}</span>
                <p class="text-sm font-medium">${message}</p>
                <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('translate-x-full');
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }

    getToastClasses(type) {
        const classes = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };
        return classes[type] || classes.info;
    }

    getToastIcon(type) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        return icons[type] || icons.info;
    }

    showModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';

        modal.innerHTML = `
            <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div class="modal-header p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${options.title || 'Modal'}</h3>
                    <button class="modal-close absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body p-6">
                    ${content}
                </div>
                ${options.footer ? `<div class="modal-footer p-6 border-t border-gray-200 dark:border-gray-700">${options.footer}</div>` : ''}
            </div>
        `;

        this.modalContainer.appendChild(modal);
        this.modalContainer.classList.remove('hidden');

        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                this.modalContainer.classList.add('hidden');
                modal.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        }, { once: true });
    }

    hideModal() {
        const modal = this.modalContainer.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                this.modalContainer.classList.add('hidden');
                modal.remove();
            }, 300);
        }
    }

    // Loading spinner
    showLoading(element, text = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner flex items-center justify-center';
        spinner.innerHTML = `
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
            <span>${text}</span>
        `;

        if (element) {
            element.innerHTML = '';
            element.appendChild(spinner);
        }

        return spinner;
    }

    hideLoading(element) {
        if (element) {
            const spinner = element.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
        }
    }

    // Utility method for responsive design
    isMobile() {
        return globalThis.innerWidth < 768;
    }

    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global UIManager instance
globalThis.UIManager = new UIManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization can go here
});