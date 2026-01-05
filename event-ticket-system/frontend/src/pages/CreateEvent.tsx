import React, { useState } from 'react';
import { eventAPI } from '../services/api';
import './CreateEvent.css';

const CreateEvent: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      setFormData({
        name: '',
        description: '',
        location: '',
        eventDate: '',
        totalSeats: '',
        price: ''
      });
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-wrapper">
      <div className="create-event-card">
        <div className="create-event-header">
          <h2>Create New Event</h2>
          <p>Fill in the details below to list a new event on the platform.</p>
        </div>

        {message && (
          <div className={`status-message ${message.includes('successfully') ? 'status-success' : 'status-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Summer Music Festival 2025"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe what makes this event special..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Madison Square Garden, NY"
              />
            </div>

            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 500"
              />
            </div>

            <div className="form-group">
              <label>Ticket Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;