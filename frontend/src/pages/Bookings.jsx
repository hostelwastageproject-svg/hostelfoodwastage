import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Download } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealFilter, setMealFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/booking');
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => mealFilter === 'all' || b.meal_type === mealFilter);

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>All Bookings</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
            <select 
              className="input-field" 
              style={{ paddingLeft: '44px', width: '200px' }}
              value={mealFilter}
              onChange={(e) => setMealFilter(e.target.value)}
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <button className="btn-primary" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Student</th>
                <th>Meal Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>#B-{booking.id}</td>
                    <td>
                      <div>{booking.student_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.reg_no}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{booking.meal_type}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
