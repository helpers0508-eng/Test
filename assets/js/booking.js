// Booking Module
// Handles service selection, slot booking, and booking flow

class BookingManager {
    constructor() {
        this.selectedService = null;
        this.selectedSlot = null;
        this.bookingData = {};
        this.init();
    }

    init() {
        this.setupServiceSelection();
        this.setupSlotSelection();
        this.setupBookingFlow();
        this.loadAvailableServices();
    }

    setupServiceSelection() {
        // Service cards click handlers
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => this.selectService(card.dataset.serviceId));
        });

        // Search functionality
        const searchInput = document.querySelector('#service-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterServices(e.target.value));
        }
    }

    setupSlotSelection() {
        // Date picker
        const datePicker = document.querySelector('#booking-date');
        if (datePicker) {
            datePicker.addEventListener('change', (e) => this.loadAvailableSlots(e.target.value));
        }

        // Time slots
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot')) {
                this.selectTimeSlot(e.target);
            }
        });
    }

    setupBookingFlow() {
        // Next/Previous buttons in booking flow
        const nextBtns = document.querySelectorAll('.booking-next');
        const prevBtns = document.querySelectorAll('.booking-prev');

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => this.previousStep());
        });

        // Booking confirmation
        const confirmBtn = document.querySelector('#confirm-booking');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmBooking());
        }
    }

    selectService(serviceId) {
        this.selectedService = serviceId;
        // Update UI
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`[data-service-id="${serviceId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Store service data
        this.bookingData.service = serviceId;

        // Navigate to service details or next step
        UIManager.showToast('Service selected!', 'success');
    }

    filterServices(query) {
        const services = document.querySelectorAll('.service-card');
        const lowerQuery = query.toLowerCase();

        services.forEach(service => {
            const title = service.querySelector('h3, p').textContent.toLowerCase();
            const description = service.querySelector('p').textContent.toLowerCase();

            if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
                service.style.display = 'block';
            } else {
                service.style.display = 'none';
            }
        });
    }

    async loadAvailableServices() {
        try {
            // Simulate API call
            const services = await this.fetchServicesAPI();
            this.renderServices(services);
        } catch (_error) {
            UIManager.showToast('Failed to load services', 'error');
        }
    }

    async loadAvailableSlots(date) {
        if (!date) return;

        try {
            const slots = await this.fetchAvailableSlotsAPI(date, this.selectedService);
            this.renderTimeSlots(slots);
        } catch (_error) {
            UIManager.showToast('Failed to load available slots', 'error');
        }
    }

    selectTimeSlot(slotElement) {
        // Clear previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Select new slot
        slotElement.classList.add('selected');
        this.selectedSlot = slotElement.dataset.slotId;

        // Store slot data
        this.bookingData.slot = this.selectedSlot;
        this.bookingData.date = document.querySelector('#booking-date').value;

        UIManager.showToast('Time slot selected!', 'success');
    }

    nextStep() {
        const currentStep = document.querySelector('.booking-step.active');
        const nextStep = currentStep.nextElementSibling;

        if (nextStep && nextStep.classList.contains('booking-step')) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            this.updateStepIndicator();
        }
    }

    previousStep() {
        const currentStep = document.querySelector('.booking-step.active');
        const prevStep = currentStep.previousElementSibling;

        if (prevStep && prevStep.classList.contains('booking-step')) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            this.updateStepIndicator();
        }
    }

    updateStepIndicator() {
        const steps = document.querySelectorAll('.booking-step');
        const indicators = document.querySelectorAll('.step-indicator');

        steps.forEach((step, index) => {
            if (step.classList.contains('active')) {
                indicators[index].classList.add('active');
            } else {
                indicators[index].classList.remove('active');
            }
        });
    }

    async confirmBooking() {
        if (!this.bookingData.service || !this.bookingData.slot) {
            UIManager.showToast('Please select a service and time slot', 'error');
            return;
        }

        try {
            await this.createBookingAPI(this.bookingData);
            UIManager.showToast('Booking confirmed!', 'success');

            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = '/booking/confirm';
            }, 2000);
        } catch (_error) {
            UIManager.showToast('Booking failed', 'error');
        }
    }

    renderServices(services) {
        const container = document.querySelector('#services-container');
        if (!container) return;

        container.innerHTML = services.map(service => `
            <div class="service-card bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                 data-service-id="${service.id}">
                <img src="${service.image}" alt="${service.name}" class="w-full h-32 object-cover rounded mb-3">
                <h3 class="font-semibold text-lg mb-2">${service.name}</h3>
                <p class="text-gray-600 text-sm">${service.description}</p>
                <div class="mt-3 flex justify-between items-center">
                    <span class="text-primary font-bold">$${service.price}</span>
                    <span class="text-sm text-gray-500">${service.duration}</span>
                </div>
            </div>
        `).join('');
    }

    renderTimeSlots(slots) {
        const container = document.querySelector('#time-slots-container');
        if (!container) return;

        container.innerHTML = slots.map(slot => `
            <button class="time-slot p-3 border rounded-lg hover:bg-primary hover:text-white transition-colors"
                    data-slot-id="${slot.id}">
                ${slot.time}
            </button>
        `).join('');
    }

    // API methods using mock data
    async fetchServicesAPI() {
        try {
            const response = await fetch('/assets/mock/services.json');
            const data = await response.json();
            return data.services;
        } catch (error) {
            console.error('Failed to fetch services:', error);
            return [];
        }
    }

    async fetchAvailableSlotsAPI(date, _serviceId) {
        try {
            const response = await fetch('/assets/mock/bookings.json');
            const data = await response.json();
            const slots = data.availableSlots[date] || [];
            return slots.filter(slot => slot.available).map(slot => ({
                id: slot.id,
                time: slot.time
            }));
        } catch (error) {
            console.error('Failed to fetch slots:', error);
            return [];
        }
    }

    async createBookingAPI(_bookingData) {
        try {
            // In a real app, this would send to backend
            // For mock, simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, bookingId: 'BK' + Date.now() };
        } catch (_error) {
            return { success: false, message: 'Booking failed' };
        }
    }
}

// Initialize booking manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.service-card') || document.querySelector('#booking-date')) {
        globalThis.bookingManager = new BookingManager();
    }
});