import React, { useState, useEffect } from 'react';
import { eventAPI, ticketAPI } from '../services/api';
import { Event, Ticket } from '../types';
import './Dashboard.css';

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
    validatedTickets: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const eventsRes = await eventAPI.getMyEvents();
      setEvents(eventsRes.data);

      const totalEvents = eventsRes.data.length;
      let totalTickets = 0;
      let totalRevenue = 0;
      let validatedTickets = 0;

      for (const event of eventsRes.data) {
        try {
          const ticketsRes = await ticketAPI.getEventTickets(event.id);
          const eventTickets = ticketsRes.data;
          totalTickets += eventTickets.length;

          for (const ticket of eventTickets) {
            // Use accurate number of seats from the ticket object
            const seats = ticket.numberOfSeats || 1;
            totalRevenue += seats * event.price;

            if (ticket.validated) {
              validatedTickets++;
            }
          }
        } catch (error) {
          console.error(`Failed to load tickets for event ${event.id}:`, error);
        }
      }

      setStats({
        totalEvents,
        totalTickets,
        totalRevenue,
        validatedTickets
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const loadEventTickets = async (eventId: number) => {
    try {
      const response = await ticketAPI.getEventTickets(eventId);
      setTickets(response.data);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Failed to load event tickets:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Premium Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📅</div>
          <h3>Total Events</h3>
          <p>{stats.totalEvents}</p>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">🎟</div>
          <h3>Total Tickets</h3>
          <p>{stats.totalTickets}</p>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">💰</div>
          <h3>Revenue</h3>
          <p>₹{stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="stat-card pink">
          <div className="stat-icon">✅</div>
          <h3>Validated</h3>
          <p>{stats.validatedTickets}</p>
        </div>
      </div>

      {/* Events Management Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Events Overview</h2>
        </div>
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>#{event.id}</td>
                  <td><strong>{event.name}</strong></td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>{event.availableSeats} / {event.totalSeats}</td>
                  <td>₹{event.price}</td>
                  <td>
                    <button
                      className="btn-action-primary"
                      onClick={() => loadEventTickets(event.id)}
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Logs Section */}
      {selectedEvent && (
        <div className="dashboard-section" id="ticket-logs">
          <div className="section-header">
            <h2 className="section-title">Ticket Logs for Event #{selectedEvent}</h2>
          </div>
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User Email</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th>QR Preview</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.userEmail}</td>
                    <td>{new Date(ticket.bookingTime).toLocaleString()}</td>
                    <td>
                      {ticket.validated ? 'Used' : 'Valid'}
                    </td>
                    <td>
                      <img
                        src={`data:image/png;base64,${ticket.qrCodeImage}`}
                        alt="QR"
                        className="qr-preview"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;