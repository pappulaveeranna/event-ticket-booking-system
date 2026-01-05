import React, { useState, useEffect } from 'react';
import { ticketAPI } from '../services/api';
import './SeatSelection.css';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
}

interface Event {
  id: number;
  name: string;
  eventDate: string;
  location: string;
  price: number;
  totalSeats?: number;
  availableSeats?: number;
}

interface SeatSelectionProps {
  eventId?: number;
  selectedEvent?: any;
  onProceedToPayment?: (data: any) => void;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ eventId = 1, selectedEvent, onProceedToPayment }) => {
  const navigate = onProceedToPayment;
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    // Determine the event data to use
    let currentEvent: Event | null = null;
    if (selectedEvent) {
      currentEvent = selectedEvent;
    } else if (eventId) {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const foundEvent = events.find((e: any) => e.id === eventId);
      currentEvent = foundEvent || {
        id: eventId,
        name: 'Tech Conference 2024',
        eventDate: '2025-06-15T09:00:00',
        location: 'Convention Center, New York',
        price: 299.99,
        totalSeats: 100,
        availableSeats: 80
      };
    }

    if (currentEvent) {
      setEvent(currentEvent);

      const fetchSeats = async () => {
        // Generate theater layout based on event capacity
        const totalSeats = currentEvent!.totalSeats || 96;

        // Dynamic layout: "Fix rows, increase columns" strategy
        const targetRows = 8;
        const seatsPerRow = Math.max(12, Math.ceil(totalSeats / targetRows));
        const totalRows = Math.ceil(totalSeats / seatsPerRow);

        const generatedSeats: Seat[] = [];
        let seatsCreated = 0;

        // Helper to generate row labels (A, B, ... Z, AA, AB...)
        const getRowLabel = (index: number) => {
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          if (index < 26) return letters[index];
          const first = letters[Math.floor(index / 26) - 1];
          const second = letters[index % 26];
          return `${first}${second}`;
        };

        // Create all seats as available first
        for (let r = 0; r < totalRows; r++) {
          const rowLabel = getRowLabel(r);
          for (let i = 1; i <= seatsPerRow; i++) {
            if (seatsCreated >= totalSeats) break;

            generatedSeats.push({
              id: `${rowLabel}${i}`,
              row: rowLabel,
              number: i,
              status: 'available'
            });
            seatsCreated++;
          }
        }

        // Fetch real booked seats from Backend
        try {
          // We expect a list of strings like ["A1", "A2", "B5"]
          const response = await ticketAPI.getBookedSeats(currentEvent!.id);
          const bookedSeatIds: string[] = response.data || [];

          // Mark fetched seats as booked
          generatedSeats.forEach(seat => {
            if (bookedSeatIds.includes(seat.id)) {
              seat.status = 'booked';
            }
          });
        } catch (err) {
          console.error("Failed to fetch booked seats, defaulting to all available", err);
        }

        setSeats(generatedSeats);
        // Important: Reset selected seats when event loads/changes
        setSelectedSeats([]);
      };

      fetchSeats();
    }
  }, [eventId, selectedEvent]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    if (seat.status === 'selected') {
      // Deselect seat
      const updatedSeats = seats.map(s =>
        s.id === seat.id ? { ...s, status: 'available' as const } : s
      );
      setSeats(updatedSeats);
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else {
      // Select seat
      const updatedSeats = seats.map(s =>
        s.id === seat.id ? { ...s, status: 'selected' as const } : s
      );
      setSeats(updatedSeats);
      setSelectedSeats(prev => {
        // Double check duplication prevention
        if (prev.find(s => s.id === seat.id)) return prev;
        return [...prev, { ...seat, status: 'selected' }];
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedSeats([]);
    setSeats(prev => prev.map(s =>
      s.status === 'selected' ? { ...s, status: 'available' as const } : s
    ));
  };

  const totalAmount = selectedSeats.length * (event?.price || 0);

  const handleProceedToPayment = () => {
    if (selectedSeats.length > 0 && onProceedToPayment) {
      const correctTotalAmount = selectedSeats.length * (event?.price || 0);
      console.log('Proceeding with seats:', selectedSeats.map(s => s.id));
      onProceedToPayment({
        event: event,
        selectedSeats,
        totalAmount: correctTotalAmount
      });
    }
  };

  if (!event) return <div className="loading">Loading...</div>;

  return (
    <div className="seat-selection-container">
      <div className="event-header">
        <h1>{event.name}</h1>
        <div className="event-details">
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          <span>{new Date(event.eventDate).toLocaleTimeString()}</span>
          <span>{event.location}</span>
          <span className="price">₹{event.price}</span>
        </div>
      </div>

      <div className="booking-layout">
        <div className="theater-section">
          <div className="screen">SCREEN</div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-demo available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="seat-demo selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="seat-demo booked"></div>
              <span>Booked</span>
            </div>
          </div>

          <div className="seating-chart">
            <div className="seating-chart">
              {Array.from(new Set(seats.map(s => s.row))).map(row => (
                <div key={row} className="seat-row">
                  <div className="row-label">{row}</div>
                  <div className="seats">
                    {seats
                      .filter(seat => seat.row === row)
                      .map(seat => (
                        <button
                          key={seat.id}
                          className={`seat ${seat.status}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'booked'}
                        >
                          {seat.number}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Booking Summary</h3>
            {selectedSeats.length > 0 && (
              <button
                onClick={handleClearSelection}
                style={{
                  background: 'none', border: '1px solid #ff7675',
                  color: '#ff7675', borderRadius: '4px', cursor: 'pointer',
                  padding: '4px 8px', fontSize: '12px'
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="selected-seats">
            <h4>Selected Seats ({selectedSeats.length})</h4>
            {selectedSeats.length === 0 ? (
              <p className="no-seats">No seats selected</p>
            ) : (
              <div className="seat-list">
                {selectedSeats.map(seat => (
                  <div key={seat.id} className="selected-seat-item">
                    <span>Row {seat.row}, Seat {seat.number}</span>
                    <span>₹{event.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="total-section">
            <div className="total-amount">
              <span>Total Amount</span>
              <span className="amount">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="proceed-btn"
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;