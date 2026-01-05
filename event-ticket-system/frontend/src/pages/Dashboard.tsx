import React, { useState, useEffect } from 'react';
import { eventAPI, ticketAPI } from '../services/api';
import { Event, Ticket } from '../types';

interface DashboardProps {
  userRole: string;
  userEmail: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, userEmail }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
    validatedTickets: 0,
    myTickets: 0,
    totalSpent: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    try {
      if (userRole === 'ADMIN') {
        const eventsRes = await eventAPI.getAllEvents();
        const eventsData: Event[] = eventsRes.data;
        setEvents(eventsData);

        let totalTickets = 0;
        let totalRevenue = 0;
        let validatedTickets = 0;

        for (const event of eventsData) {
          const ticketsRes = await ticketAPI.getEventTickets(event.id);

          const eventTickets: Ticket[] = ticketsRes.data;   // ✅ FIX

          totalTickets += eventTickets.length;
          totalRevenue += eventTickets.length * event.price;
          validatedTickets += eventTickets.filter((t: Ticket) => t.validated).length;
        }

        setStats({
          totalEvents: eventsData.length,
          totalTickets,
          totalRevenue,
          validatedTickets,
          myTickets: 0,
          totalSpent: 0
        });

      } else {
        const ticketsRes = await ticketAPI.getMyTickets();
        const myTickets: Ticket[] = ticketsRes.data;    // ✅ FIX
        setTickets(myTickets);

        const eventsRes = await eventAPI.getUpcomingEvents();
        const upcomingEvents: Event[] = eventsRes.data;
        setEvents(upcomingEvents);

        let totalSpent = 0;

        for (const ticket of myTickets) {
          try {
            const eventRes = await eventAPI.getEvent(ticket.eventId);
            totalSpent += eventRes.data.price;
          } catch (error) {
            console.error('Error fetching event price:', error);
          }
        }

        setStats({
          totalEvents: upcomingEvents.length,
          totalTickets: 0,
          totalRevenue: 0,
          validatedTickets: 0,
          myTickets: myTickets.length,
          totalSpent
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleBookTicket = async (eventId: number) => {
    try {
      await ticketAPI.bookTicket(eventId);
      alert('Ticket booked successfully!');
      loadDashboardData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    }
  };

  // ================= ADMIN =================
  if (userRole === 'ADMIN') {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Admin Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <Stat title="Total Events" value={stats.totalEvents} />
          <Stat title="Total Tickets" value={stats.totalTickets} />
          <Stat title="Total Revenue" value={`$${stats.totalRevenue}`} />
          <Stat title="Validated Tickets" value={stats.validatedTickets} />
        </div>
      </div>
    );
  }

  // ================= USER =================
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {userEmail}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <Stat title="My Tickets" value={stats.myTickets} />
        <Stat title="Used Tickets" value={tickets.filter((t: Ticket) => t.validated).length} /> {/* ✅ FIX */}
        <Stat title="Total Spent" value={`$${stats.totalSpent}`} />
        <Stat title="Available Events" value={stats.totalEvents} />
      </div>
    </div>
  );
};

const Stat = ({ title, value }: { title: string; value: any }) => (
  <div style={{ padding: '20px', background: '#f4f4f4', borderRadius: '8px', textAlign: 'center' }}>
    <h3>{title}</h3>
    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default Dashboard;
