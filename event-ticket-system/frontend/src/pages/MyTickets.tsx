import React, { useState, useEffect } from 'react';
import { ticketAPI, eventAPI } from '../services/api';
import { Ticket, Event } from '../types';
import './MyTickets.css';

import html2canvas from 'html2canvas';

interface TicketWithEvent extends Ticket {
  event?: Event;
  selectedSeats?: any[];
  totalAmount?: number;
  paymentMethod?: string;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingTicket, setCancellingTicket] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const getUserName = (email: string) => {
    return email.split('@')[0];
  };

  const getDisplayName = (email: string) => {
    const fullName = localStorage.getItem('userFullName');
    return fullName || getUserName(email);
  };

  useEffect(() => {
    loadTickets();
    // Check if user just completed a booking
    const justBooked = sessionStorage.getItem('justBooked');
    if (justBooked) {
      setShowSuccessMessage(true);
      sessionStorage.removeItem('justBooked');
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, []);

  const loadTickets = async () => {
    try {
      const response = await ticketAPI.getMyTickets();

      const ticketsWithEvents = await Promise.all(
        response.data.map(async (ticket: Ticket) => {
          try {
            const eventResponse = await eventAPI.getEvent(ticket.eventId);

            return {
              ...ticket,
              event: eventResponse.data,
              // Calculate total amount. Ideally this should be stored in backend ticket
              totalAmount: ticket.numberOfSeats * (eventResponse.data.price || 0)
            };
          } catch {
            return ticket;
          }
        })
      );
      setTickets(ticketsWithEvents);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: number) => {
    if (!window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) {
      return;
    }

    setCancellingTicket(ticketId);
    try {
      await ticketAPI.cancelTicket(ticketId);
      alert('Ticket cancelled successfully!');
      loadTickets(); // Refresh tickets
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel ticket');
    } finally {
      setCancellingTicket(null);
    }
  };



  const downloadTicketDetails = async (ticket: TicketWithEvent) => {
    const ticketElement = document.getElementById(`ticket-card-${ticket.id}`);
    if (!ticketElement) return;

    try {
      // Add a temporary class for styling during capture if needed, or just capture as is
      const canvas = await html2canvas(ticketElement, {
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true // For QR code images if they are external
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Ticket_${ticket.id}_${ticket.event?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Event'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating ticket image:', error);
      alert('Failed to generate ticket image. Please try again.');
    }
  };

  const canCancelTicket = (ticket: TicketWithEvent) => {
    if (ticket.validated) return false;
    if (!ticket.event) return false;

    const eventDate = new Date(ticket.event.eventDate);
    const now = new Date();
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursUntilEvent > 24; // Can cancel if more than 24 hours before event
  };

  if (loading) return <div className="loading">Loading your tickets...</div>;

  if (tickets.length === 0) {
    return (
      <div className="no-tickets">
        <h2>My Tickets</h2>
        <p>You haven't booked any tickets yet.</p>
        <p>Browse available events to book your first ticket!</p>
      </div>
    );
  }

  return (
    <div className="my-tickets">
      {showSuccessMessage && (
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
          animation: 'slideIn 0.5s ease'
        }}>
          🎉 Ticket booked successfully! Your tickets are ready below.
        </div>
      )}

      <h2>My Tickets ({tickets.length})</h2>

      <div className="tickets-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-number">{tickets.filter(t => !t.validated).length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{tickets.filter(t => t.validated).length}</span>
            <span className="stat-label">Used</span>
          </div>
        </div>
      </div>

      <div className="tickets-grid">
        {tickets.map((ticket) => {
          const isValidated = ticket.validated;
          const canCancel = canCancelTicket(ticket);
          const isPastEvent = ticket.event && new Date(ticket.event.eventDate) < new Date();

          return (
            <div key={ticket.id} id={`ticket-card-${ticket.id}`} className={`ticket-card ${isValidated ? 'validated' : 'active'} ${isPastEvent ? 'expired' : ''}`}>
              {/* Left Side: Main Ticket Info */}
              <div className="ticket-main">
                <div className="ticket-header">
                  <h3>Ticket #{ticket.id}</h3>
                  <div className="ticket-status-badge">
                    {isValidated ? 'USED' : isPastEvent ? 'EXPIRED' : 'ACTIVE'}
                  </div>
                </div>

                {ticket.event && (
                  <div className="ticket-event-info">
                    <h2 className="event-name">{ticket.event.name}</h2>

                    <div className="info-row">
                      <div className="info-item">
                        <span className="label">📍 LOCATION</span>
                        <span className="value">{ticket.event.location}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">📅 DATE</span>
                        <span className="value">{new Date(ticket.event.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">⏰ TIME</span>
                        <span className="value">{new Date(ticket.event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="ticket-details-grid">
                  <div className="detail-group">
                    <span className="label">🎫 TICKET HOLDER</span>
                    <span className="value">{getDisplayName(ticket.userEmail)}</span>
                  </div>
                  {ticket.seatNumbers && (
                    <div className="detail-group">
                      <span className="label">💺 SEATS</span>
                      <span className="value seats-value">
                        {ticket.seatNumbers}
                      </span>
                    </div>
                  )}
                  <div className="detail-group">
                    <span className="label">💰 PRICE</span>
                    <span className="value">₹{ticket.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">📅 BOOKED ON</span>
                    <span className="value">{new Date(ticket.bookingTime).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="ticket-actions" data-html2canvas-ignore="true">
                  {canCancel && (
                    <button
                      onClick={() => handleCancelTicket(ticket.id)}
                      disabled={cancellingTicket === ticket.id}
                      className="action-link cancel"
                    >
                      {cancellingTicket === ticket.id ? 'Cancelling...' : 'Cancel Ticket'}
                    </button>
                  )}
                  {!canCancel && !isValidated && !isPastEvent && (
                    <span className="cancel-locked">Non-cancellable</span>
                  )}
                </div>
              </div>

              {/* Separator with notches (handled by CSS) */}
              <div className="ticket-divider"></div>

              {/* Right Side: Stub & QR */}
              <div className="ticket-stub">
                <div className="qr-wrapper">
                  <img
                    src={`data:image/png;base64,${ticket.qrCodeImage}`}
                    alt="QR Code"
                    className="qr-image"
                  />
                </div>
                <div className="stub-info">
                  <span className="stub-label">🎟️ ENTRY CODE</span>
                  <span className="stub-code">{ticket.id}</span>
                </div>

                <button
                  onClick={() => downloadTicketDetails(ticket)}
                  className="download-icon-btn"
                  title="Download Ticket"
                  data-html2canvas-ignore="true"
                >
                  📥
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTickets;