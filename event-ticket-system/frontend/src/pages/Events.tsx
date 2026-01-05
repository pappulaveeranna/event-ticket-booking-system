import React, { useState, useEffect } from 'react';
import { eventAPI, ticketAPI } from '../services/api';
import { Event } from '../types';
import SeatSelection from './SeatSelection';
import Payment from './Payment';
import './Events.css';

interface EventsProps {
  userRole: string;
  onNavigate?: (page: string) => void;
}

const Events: React.FC<EventsProps> = ({ userRole, onNavigate }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'available'>('all');
  const [currentView, setCurrentView] = useState<'events' | 'seats' | 'payment' | 'details'>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, filterType]);

  const loadEvents = async () => {
    try {
      const response = userRole === 'ADMIN'
        ? await eventAPI.getMyEvents()
        : await eventAPI.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'upcoming':
        filtered = filtered.filter(event => new Date(event.eventDate) > new Date());
        break;
      case 'available':
        filtered = filtered.filter(event => event.availableSeats > 0);
        break;
      default:
        break;
    }

    setFilteredEvents(filtered);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('details');
  };

  const handleBookTicket = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('seats');
  };

  const handleProceedToPayment = (data: any) => {
    setBookingData(data);
    setCurrentView('payment');
  };

  const handlePaymentSuccess = (ticketData: any) => {
    setCurrentView('events');
    setSelectedEvent(null);
    setBookingData(null);
    loadEvents();
    // Set success flag for My Tickets page
    sessionStorage.setItem('justBooked', 'true');
    // Navigate to My Tickets page
    if (onNavigate) {
      onNavigate('tickets');
    }
  };

  const handleBackToEvents = () => {
    setCurrentView('events');
    setSelectedEvent(null);
    setBookingData(null);
  };

  if (currentView === 'details' && selectedEvent) {
    return (
      <div className="event-details-page">
        <button onClick={handleBackToEvents} className="back-btn">
          ← Back to Events
        </button>
        <div className="event-details-container">
          <div className="event-header-detail">
            <h1 className="event-title-detail">{selectedEvent.name}</h1>
            <div className="event-meta-info">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{selectedEvent.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>{new Date(selectedEvent.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">⏰</span>
                <span>{new Date(selectedEvent.eventDate).toLocaleTimeString()}</span>
              </div>
              <div className="meta-item price-highlight">
                <span className="meta-icon">💰</span>
                <span>₹{selectedEvent.price}</span>
              </div>
            </div>
          </div>

          <div className="event-content">
            <div className="description-section">
              <h3>About This Event</h3>
              <p className="description-text">{selectedEvent.description}</p>
            </div>

            <div className="booking-info">
              <div className="seats-info">
                <span className="seats-available">{selectedEvent.availableSeats}</span>
                <span className="seats-total">/ {selectedEvent.totalSeats} seats available</span>
              </div>

              {userRole === 'USER' && new Date(selectedEvent.eventDate) > new Date() && (
                <button
                  onClick={() => handleBookTicket(selectedEvent)}
                  disabled={selectedEvent.availableSeats === 0}
                  className="book-now-btn"
                >
                  {selectedEvent.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading events...</div>;

  if (currentView === 'seats' && selectedEvent) {
    return (
      <div>
        <button onClick={handleBackToEvents} style={{ margin: '20px', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back to Events
        </button>
        <SeatSelection
          selectedEvent={selectedEvent}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    );
  }

  if (currentView === 'payment' && bookingData) {
    return (
      <div>
        <button onClick={() => setCurrentView('seats')} style={{ margin: '20px', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Back to Seat Selection
        </button>
        <Payment
          event={bookingData.event}
          selectedSeats={bookingData.selectedSeats}
          totalAmount={bookingData.totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  return (
    <div className="events-page-wrapper">
      <div className="events-header-section">
        <h2>Available Events</h2>

        <div className="events-controls">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-search-input"
            />
          </div>

          <div className="filter-wrapper">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="custom-filter-select"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="events-stats">
        <p>Showing {filteredEvents.length} results</p>
      </div>

      <div className="premium-events-grid">
        {filteredEvents.map((event) => {
          const isUpcoming = new Date(event.eventDate) > new Date();
          const isSoldOut = event.availableSeats === 0;

          return (
            <div key={event.id} className="premium-event-card" onClick={() => handleEventClick(event)} style={{ cursor: 'pointer' }}>
              <div className="card-content-wrapper">
                {isUpcoming && isSoldOut && <span className="status-badge badge-soldout">Sold Out</span>}
                {!isUpcoming && <span className="status-badge badge-past">Past</span>}

                <h3 className="event-title">{event.name}</h3>

                <p className="event-description">{event.description}</p>

                <div className="event-info-list">
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span>{new Date(event.eventDate).toLocaleDateString()} • {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🎫</span>
                    <span>{event.availableSeats} / {event.totalSeats} seats</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">💰</span>
                    <span className="price-tag">₹{event.price}</span>
                  </div>
                </div>

                <div className="card-actions">
                  {userRole === 'USER' && isUpcoming && (
                    <button
                      onClick={() => handleBookTicket(event)}
                      disabled={isSoldOut}
                      className="btn-book-ticket"
                    >
                      {isSoldOut ? 'Sold Out' : 'Book Now'}
                    </button>
                  )}

                  {!isUpcoming && (
                    <div style={{ textAlign: 'center', color: '#999', padding: '10px' }}>
                      Event has ended
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Try adjusting your search or filter criteria</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="btn-clear">
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;