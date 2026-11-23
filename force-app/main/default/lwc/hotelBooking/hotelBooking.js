import { LightningElement } from 'lwc';

export default class HotelBooking extends LightningElement {
    // Booking form values
    selectedRoomType = '';
    selectedGuests = '1';
    checkInDate = '';
    checkOutDate = '';

    // Booking message
    bookingMessage = '';
    messageType = '';

    // Available room types
    roomTypes = [
        { label: 'Standard Room', value: 'standard' },
        { label: 'Deluxe Room', value: 'deluxe' },
        { label: 'Executive Suite', value: 'executive' },
        { label: 'Presidential Suite', value: 'presidential' }
    ];

    // Guest options
    guestOptions = [
        { label: '1 Guest', value: '1' },
        { label: '2 Guests', value: '2' },
        { label: '3 Guests', value: '3' },
        { label: '4 Guests', value: '4' }
    ];

    // Get today's date in YYYY-MM-DD format
    get today() {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Checkout date must be on or after check-in date
    get checkOutMin() {
        return this.checkInDate || this.today;
    }

    // CSS class for booking message
    get messageClass() {
        return this.messageType === 'success'
            ? 'booking-message booking-message-success'
            : 'booking-message booking-message-error';
    }

    // Scroll to booking form
    handleBookNow() {
        const bookingSection = this.template.querySelector('.booking-section');

        if (bookingSection) {
            bookingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Scroll to services section
    handleViewRooms() {
        const servicesSection = this.template.querySelector('.services-section');

        if (servicesSection) {
            servicesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Chat with Roomie AI
    handleChatWithRoomie() {
        console.log('Chat with Roomie clicked');

        // TODO: Connect your Agentforce or chatbot launch logic here.
    }

    // Room type selection
    handleRoomTypeChange(event) {
        this.selectedRoomType = event.detail.value;
        this.clearBookingMessage();
    }

    // Guest selection
    handleGuestsChange(event) {
        this.selectedGuests = event.detail.value;
        this.clearBookingMessage();
    }

    // Check-in date selection
    handleCheckInChange(event) {
        this.checkInDate = event.target.value;

        // Reset checkout if it is earlier than or equal to the new check-in
        if (this.checkOutDate && this.checkOutDate <= this.checkInDate) {
            this.checkOutDate = '';
        }

        this.clearBookingMessage();
    }

    // Check-out date selection
    handleCheckOutChange(event) {
        this.checkOutDate = event.target.value;
        this.clearBookingMessage();
    }

    // Clear validation message when the user changes a field
    clearBookingMessage() {
        this.bookingMessage = '';
        this.messageType = '';
    }

    // Check booking form
    handleCheckAvailability() {
        const inputs = this.template.querySelectorAll(
            'lightning-input, lightning-combobox'
        );

        let isValid = true;

        // Validate all Lightning inputs and comboboxes
        inputs.forEach((input) => {
            if (!input.reportValidity()) {
                isValid = false;
            }
        });

        // Stop if required fields are missing
        if (!isValid) {
            this.bookingMessage = 'Please complete all required fields.';
            this.messageType = 'error';
            return;
        }

        // Validate check-in date
        if (this.checkInDate < this.today) {
            this.bookingMessage = 'Check-in date cannot be in the past.';
            this.messageType = 'error';
            return;
        }

        // Validate check-out date
        if (this.checkOutDate <= this.checkInDate) {
            this.bookingMessage = 'Check-out must be after check-in.';
            this.messageType = 'error';
            return;
        }

        // Collect booking information
        const bookingDetails = {
            checkIn: this.checkInDate,
            checkOut: this.checkOutDate,
            roomType: this.selectedRoomType,
            guests: this.selectedGuests
        };

        console.log(
            'Booking Details:',
            JSON.stringify(bookingDetails)
        );

        // The form is validated, but real hotel availability
        // is not connected yet.
        this.bookingMessage =
            'Your details look good! The availability service is not connected yet.';
        this.messageType = 'success';

        // TODO: Call Apex here to check real room availability.
    }
}