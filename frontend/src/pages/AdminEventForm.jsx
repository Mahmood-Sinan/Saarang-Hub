import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminEventForm = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const edit = !!id; //if id is present edit, or else create a new event
  const adminToken = localStorage.getItem('adminToken');
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', 
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  });
  const [error, setError] = useState('');
  if(edit){
    useEffect(() => {
      if (!adminToken) return;

      const fetchEventDetails = async () => {
        console.log('fetching event detail')
        try {
          const response = await api.get(`/events/${id}`);
          const eventData = response.data;
          eventData.date = eventData.date.slice(0, 16);
          setFormData(eventData);
        }
        catch (e) {
          console.log(error);
        }
      }
      fetchEventDetails();
    }, []);
  }
  const handleChange = (e)=>{
    setFormData({title: formData.title,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                imageUrl: formData.imageUrl,
                [e.target.name]: e.target.value});
  };
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      if(edit){
        console.log('requesting for edit')
        await api.put(`/events/${id}/edit`, formData, {headers: {authorization: `Bearer ${adminToken}`}});
      }else{
        await api.post(`events/new`, formData, {headers: {authorization: `Bearer ${adminToken}`}});
      }
      navigate(`/admin`);
      console.log('saved new event');
    } catch(e){
      setError('Failed to save event.');
    }
  }
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

        {error && <div className="error-message">{error}</div>}

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

          <button type="submit" className="btn btn-primary btn-block" style={{ fontSize: '1.1rem', padding: '1rem' }}>
            {edit ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminEventForm;