import React, { useState } from 'react';
import { ticketAPI } from '../services/api';
import './Payment.css';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'upi' | 'card' | 'wallet';
}

interface PaymentProps {
  event?: any;
  selectedSeats?: any[];
  totalAmount?: number;
  onPaymentSuccess?: (data: any) => void;
}

const Payment: React.FC<PaymentProps> = ({
  event = {
    name: 'Tech Conference 2024',
    eventDate: '2025-06-15T09:00:00',
    location: 'Convention Center, New York',
    price: 299.99
  },
  selectedSeats = [{ id: 'A1', row: 'A', number: 1 }],
  totalAmount = 299.99,
  onPaymentSuccess
}) => {
  const navigate = onPaymentSuccess;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 'upi', name: 'UPI Payment', icon: '📱', type: 'upi' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', type: 'card' },
    { id: 'paytm', name: 'Paytm Wallet', icon: '💰', type: 'wallet' },
    { id: 'gpay', name: 'Google Pay', icon: '🔵', type: 'wallet' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣', type: 'wallet' }
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      setIsProcessing(false);

      // Book ticket via backend API
      try {
        console.log('Booking ticket for event:', event.id);
        const seatIds = selectedSeats.map((s: any) => s.id);
        const response = await ticketAPI.bookTicket(Number(event.id), selectedSeats.length, seatIds);
        console.log('Booking response:', response.data);
        const backendTicket = response.data;

        const ticketData = {
          id: backendTicket.id,
          eventId: backendTicket.eventId || event.id,
          event: event,
          userEmail: backendTicket.userEmail,
          qrCode: backendTicket.qrCode,
          qrCodeImage: `data:image/png;base64,${backendTicket.qrCodeImage}`,
          validated: backendTicket.validated,
          bookingTime: backendTicket.bookingTime,
          selectedSeats: selectedSeats, // All selected seats in one ticket
          paymentMethod: selectedPaymentMethod,
          transactionId: 'TXN' + Date.now(),
          totalAmount: totalAmount + totalAmount * 0.02 // Total amount for all seats
        };

        // Save to localStorage for offline access
        const existingTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
        existingTickets.push(ticketData);
        localStorage.setItem('userTickets', JSON.stringify(existingTickets));

        // Update event available seats in localStorage
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const eventIndex = events.findIndex((e: any) => e.id === event.id);
        if (eventIndex >= 0) {
          events[eventIndex].availableSeats = events[eventIndex].availableSeats - selectedSeats.length;
          localStorage.setItem('events', JSON.stringify(events));
        }

        // Show success animation
        setIsProcessing(false);
        setShowSuccess(true);

        // Navigate after animation
        setTimeout(() => {
          if (onPaymentSuccess) {
            onPaymentSuccess(ticketData);
          }
        }, 3000);
      } catch (error: any) {
        console.error('Booking failed:', error);
        console.error('Error response:', error.response?.data);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Booking failed. Please try again.';
        alert(errorMessage);
        setIsProcessing(false);
      }
    }, 3000);
  };

  if (!event || !selectedSeats) {
    // Use default values instead of error
  }

  return (
    <div className="payment-container">
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '50px',
            textAlign: 'center',
            maxWidth: '400px',
            animation: 'slideUp 0.6s ease-out'
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '20px',
              animation: 'bounce 1s ease-in-out infinite'
            }}>🎫</div>
            <h2 style={{
              color: '#4CAF50',
              marginBottom: '15px',
              fontSize: '28px'
            }}>Payment Successful!</h2>
            <p style={{
              color: '#666',
              fontSize: '16px',
              marginBottom: '20px'
            }}>Your tickets have been booked successfully</p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              <div style={{
                width: '60px',
                height: '30px',
                backgroundColor: '#4CAF50',
                borderRadius: '8px',
                border: '2px dashed white',
                animation: 'ticketFloat 2s ease-in-out infinite'
              }}></div>
              <div style={{
                width: '60px',
                height: '30px',
                backgroundColor: '#FF9800',
                borderRadius: '8px',
                border: '2px dashed white',
                animation: 'ticketFloat 2s ease-in-out infinite 0.3s'
              }}></div>
              <div style={{
                width: '60px',
                height: '30px',
                backgroundColor: '#2196F3',
                borderRadius: '8px',
                border: '2px dashed white',
                animation: 'ticketFloat 2s ease-in-out infinite 0.6s'
              }}></div>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes bounce {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.2); }
            }
            @keyframes ticketFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }
          `}</style>
        </div>
      )}
      <div className="payment-header">
        <div className="security-badge">
          <span className="lock-icon">🔒</span>
          <span>Secure Payment</span>
        </div>
        <h1>Complete Your Booking</h1>
      </div>

      <div className="payment-content">
        <div className="booking-summary">
          <h2>Booking Summary</h2>

          <div className="event-info">
            <h3>{event.name}</h3>
            <div className="event-details">
              <p>{new Date(event.eventDate).toLocaleDateString()}</p>
              <p>{new Date(event.eventDate).toLocaleTimeString()}</p>
              <p>{event.location}</p>
            </div>
          </div>

          <div className="seat-details">
            <h4>Selected Seats</h4>
            <div className="seat-list">
              {selectedSeats.map((seat: any) => (
                <div key={seat.id} className="seat-item">
                  <span>Row {seat.row}, Seat {seat.number}</span>
                  <span>₹{event.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Tickets ({selectedSeats.length})</span>
              <span>₹{(selectedSeats.length * event.price).toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Convenience Fee</span>
              <span>₹{(totalAmount * 0.02).toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{(totalAmount + totalAmount * 0.02).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h2>Payment Method</h2>

          <div className="payment-methods">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <span className="method-icon">{method.icon}</span>
                <span className="method-name">{method.name}</span>
                <span className="radio-btn"></span>
              </div>
            ))}
          </div>

          {selectedPaymentMethod === 'card' && (
            <div className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  maxLength={19}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                />
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'upi' && (
            <div className="upi-form">
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || isProcessing}
          >
            {isProcessing ? (
              <span className="processing">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : (
              `Pay Now ₹${(totalAmount + totalAmount * 0.02).toFixed(2)}`
            )}
          </button>

          <div className="security-info">
            <p>🔒 Your payment information is encrypted and secure</p>
            <p>💳 We accept all major credit and debit cards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;