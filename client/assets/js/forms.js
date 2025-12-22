// Forms Module
// Handles form validation, error handling, and submission

class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupErrorHandling();
    }

    setupFormValidation() {
        // Get all forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e));
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    setupErrorHandling() {
        // Global error handler for fetch requests
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            UIManager.showToast('An unexpected error occurred', 'error');
        });

        // Handle network errors
        window.addEventListener('offline', () => {
            UIManager.showToast('You are offline. Please check your connection.', 'warning');
        });

        window.addEventListener('online', () => {
            UIManager.showToast('You are back online.', 'success');
        });
    }

    validateForm(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            UIManager.showToast('Please correct the errors in the form', 'error');
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required`;
        }

        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Password validation
        else if (field.type === 'password' && value) {
            if (value.length < 8) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters long';
            }
            // Check for password confirmation
            if (fieldName === 'confirmPassword' || fieldName === 'password-confirm') {
                const passwordField = form.querySelector('input[name="password"]') ||
                                    form.querySelector('input[name="newPassword"]');
                if (passwordField && value !== passwordField.value) {
                    isValid = false;
                    errorMessage = 'Passwords do not match';
                }
            }
        }

        // Phone validation
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Name validation
        else if (fieldName === 'name' || fieldName === 'fullName') {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
        }

        // OTP validation
        else if (fieldName === 'otp' && value) {
            if (!/^\d{6}$/.test(value)) {
                isValid = false;
                errorMessage = 'OTP must be 6 digits';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    getFieldLabel(field) {
        // Try to find label text
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.trim().replace('*', '').replace(':', '');
        }

        // Fallback to field name or placeholder
        return field.placeholder || field.name || 'This field';
    }

    showFieldError(field, message) {
        field.classList.add('error');

        // Create or update error message
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Utility method to serialize form data
    serializeForm(form) {
        const data = {};
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    // Method to show loading state
    setFormLoading(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Loading...' : submitBtn.dataset.originalText || 'Submit';
            if (!submitBtn.dataset.originalText) {
                submitBtn.dataset.originalText = submitBtn.textContent;
            }
        }
    }
}

// Initialize form manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.formManager = new FormManager();
});