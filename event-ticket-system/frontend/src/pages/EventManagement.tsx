import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import './EventManagement.css';

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  eventDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
}

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    eventDate: '',
    totalSeats: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getMyEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      eventDate: '',
      totalSeats: '',
      price: ''
    });
    setEditingEvent(null);
    setShowCreateForm(false);
    setMessage('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const eventData = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price)
      };

      await eventAPI.createEvent(eventData);
      setMessage('Event created successfully!');
      resetForm();
      fetchEvents();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    setMessage('');

    try {
      const eventData = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price)
      };

      await eventAPI.updateEvent(editingEvent.id, eventData);
      setMessage('Event updated successfully!');
      resetForm();
      fetchEvents();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      location: event.location,
      eventDate: event.eventDate.slice(0, 16),
      totalSeats: event.totalSeats.toString(),
      price: event.price.toString()
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventAPI.deleteEvent(eventId);
      setMessage('Event deleted successfully!');
      fetchEvents();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to delete event');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="event-management-container">
      <div className="management-header">
        <h2>Event Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-create-event"
        >
          {showCreateForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {showCreateForm && (
        <div className="create-form-container">
          <h3>{editingEvent ? 'Update Event' : 'Create New Event'}</h3>
          <form onSubmit={editingEvent ? handleUpdate : handleCreate}>
            <div className="form-grid">
              <div className="form-group">
                <label>Event Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Event Date & Time:</label>
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Price (₹):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Total Seats:</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  required
                  min="1"
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="form-textarea"
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn-submit"
              >
                {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Location</th>
              <th>Date & Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="event-name-cell">
                    <strong>{event.name}</strong>
                    <div className="event-description">
                      {event.description.length > 50 ? event.description.substring(0, 50) + '...' : event.description}
                    </div>
                  </div>
                </td>
                <td>{event.location}</td>
                <td>{formatDate(event.eventDate)}</td>
                <td>₹{event.price}</td>
                <td>{event.availableSeats}/{event.totalSeats}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(event)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <div className="empty-state">
            No events found. Create your first event!
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;