import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminEventForm = ({ username, setUsername, isAdminLoggedIn, setIsAdminLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const edit = !!id; //if id is present edit, or else create a new event
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', location: '',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  });
  const [eventFetchError, setEventFetchError] = useState('');
  const [eventFetchLoading, setEventFetchLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  if (edit) {
    useEffect(() => {
      if (!isAdminLoggedIn) return;

      const fetchEventDetails = async () => {
        console.log('fetching event detail')
        setEventFetchError('');
        setEventFetchLoading(true);
        try {
          const response = await api.get(`/events/${id}`);
          const eventData = response.data;
          eventData.date = eventData.date.slice(0, 16);
          setFormData(eventData);
        }
        catch (e) {
          console.log(e);
          setEventFetchError('Failed to fetch event details.');
        } finally {
          setEventFetchLoading(false);
        }
      }
      fetchEventDetails();
    }, []);
  }
  const handleChange = (e) => {
    setFormData({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      imageUrl: formData.imageUrl,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    try {
      if (edit) {
        console.log('requesting for edit')
        await api.put(`/events/${id}/edit`, formData);
      } else {
        await api.post(`events/new`, formData);
      }
      navigate(`/admin`);
      console.log('saved new event');
    } catch (e) {
      if (edit) {
        setSubmitError('Failed to edit event.');
      } else {
        setSubmitError('Failed to save event.');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  if (edit && eventFetchLoading) return <div className="text-center mt-8 container">Loading Event Details...</div>;
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>
            {edit ? 'Edit Event' : 'Create New Event'}
          </h1>
          <button onClick={() => navigate('/admin')} className="btn" >
            Cancel
          </button>
        </div>

        {(edit && eventFetchError) && <div className="error-message">{eventFetchError}</div>}
        {submitError && (<div className="error-message">{submitError}</div>)}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1" style={{ gap: '1.5rem', marginBottom: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label className="form-label">Date and Time</label>
              <input
                type="datetime-local"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-control"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={{ width: '100%', height: '200px', objectFit: 'cover', marginTop: '1rem', borderRadius: '0.5rem' }}
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitLoading}
            style={{
              fontSize: '1.1rem', padding: '1rem', opacity: submitLoading ? 0.7 : 1,
              cursor: submitLoading ? 'not-allowed' : 'pointer'
            }}>
            {submitLoading ? (edit
              ? <div className="loading-inline">
                    <span>Updating Event</span>
                    <div className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
              : <div className="loading-inline">
                    <span>Creating Event</span>
                    <div className="loading-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
            ) : (
              edit
                ? 'Update Event'
                : 'Create Event'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminEventForm;