import React, { useState, useEffect } from 'react';
import { eventAPI, ticketAPI } from '../services/api';
import { Event, Ticket } from '../types';

interface UserDashboardProps {
  userEmail: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userEmail }) => {
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    upcomingEvents: 0,
    totalSpent: 0,
    usedTickets: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user tickets
      const ticketsRes = await ticketAPI.getMyTickets();
      const tickets: Ticket[] = ticketsRes.data;   // ✅ FIX
      setMyTickets(tickets);

      // Load upcoming events
      const eventsRes = await eventAPI.getUpcomingEvents();
      const events: Event[] = eventsRes.data;      // ✅ FIX
      setUpcomingEvents(events);

      // Calculate stats
      const totalTickets = tickets.length;
      const usedTickets = tickets.filter((t: Ticket) => t.validated).length; // ✅ FIX
      let totalSpent = 0;

      // Calculate total spent
      for (const ticket of tickets) {
        try {
          const eventRes = await eventAPI.getEvent(ticket.eventId);
          totalSpent += eventRes.data.price;
        } catch (error) {
          console.error('Error fetching event price:', error);
        }
      }

      setStats({
        totalTickets,
        upcomingEvents: events.length,
        totalSpent,
        usedTickets
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleBookTicket = async (eventId: number) => {
    try {
      await ticketAPI.bookTicket(eventId);
      alert('Ticket booked successfully!');
      loadUserData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {userEmail}!</h1>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Stat title="My Tickets" value={stats.totalTickets} />
        <Stat title="Used Tickets" value={stats.usedTickets} />
        <Stat title="Total Spent" value={`$${stats.totalSpent}`} />
        <Stat title="Upcoming Events" value={stats.upcomingEvents} />
      </div>

      {/* My Tickets */}
      <h2>My Tickets</h2>
      {myTickets.map((ticket: Ticket) => (
        <div key={ticket.id}>
          Ticket #{ticket.id} - {ticket.validated ? 'USED' : 'VALID'}
        </div>
      ))}

      {/* Upcoming Events */}
      <h2>Book New Tickets</h2>
      {upcomingEvents.map((event: Event) => (
        <div key={event.id}>
          {event.name} - ${event.price}
          <button onClick={() => handleBookTicket(event.id)}>Book</button>
        </div>
      ))}
    </div>
  );
};

const Stat = ({ title, value }: { title: string; value: any }) => (
  <div style={{ padding: 20, background: '#f4f4f4', borderRadius: 8 }}>
    <h3>{title}</h3>
    <p style={{ fontSize: 22, fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default UserDashboard;
