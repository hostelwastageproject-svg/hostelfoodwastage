import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UtensilsCrossed, CalendarCheck, MessageSquareWarning } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ 
      width: '60px', height: '60px', borderRadius: '50%', 
      background: `var(--${color}-light, rgba(46, 125, 50, 0.1))`, 
      color: `var(--${color}, var(--brand-primary))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{value}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_bookings: 0,
    todays_bookings: 0,
    active: 0,
    cancelled: 0,
    meal_breakdown: []
  });
  
  const [loading, setLoading] = useState(true);

  // Mocked recent complaints for the UI requirement
  const recentComplaints = [
    { id: 101, student: 'Alice Johnson', reg: 'REG001', topic: 'Food Quality', status: 'pending', date: '2026-03-28' },
    { id: 102, student: 'Bob Smith', reg: 'REG045', topic: 'Quantity Issue', status: 'resolved', date: '2026-03-27' },
    { id: 103, student: 'Charlie Davis', reg: 'REG112', topic: 'Menu Change', status: 'pending', date: '2026-03-26' },
  ];

  const fetchDashboardData = async () => {
    try {
      const auth = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }};
      const res = await axios.get('http://localhost:5000/api/dashboard/stats', auth);
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format Recharts data safely
  const chartData = stats.meal_breakdown?.map(item => ({
    name: item.meal_type.charAt(0).toUpperCase() + item.meal_type.slice(1),
    value: parseInt(item.count, 10)
  })) || [{ name: 'No Data', value: 1 }];

  const COLORS = ['#2E7D32', '#66BB6A', '#F9A825', '#E53935'];

  if (loading) return <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading dashboard...</div>;

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Overview</h1>
      </div>

      {/* Constraints: Top Stats Cards (Total Students, Today's Bookings, Total Complaints, Meals Count) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <DashboardCard title="Total Students" value={stats.total_students || 0} icon={<Users size={28} />} color="brand-primary" />
        <DashboardCard title="Today's Bookings" value={stats.todays_bookings || 0} icon={<CalendarCheck size={28} />} color="success" />
        <DashboardCard title="Total Complaints" value="3" icon={<MessageSquareWarning size={28} />} color="danger" />
        <DashboardCard title="Total Meals Count" value={stats.total_bookings || 0} icon={<UtensilsCrossed size={28} />} color="warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Chart (Meal Distribution) */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Meal Distribution</h2>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Recent Complaints</h2>
            <span style={{ fontSize: '14px', color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500 }}>View All</span>
          </div>
          
          <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Info</th>
                  <th>Issue Topic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No recent complaints found.
                    </td>
                  </tr>
                ) : (
                  recentComplaints.map((comp) => (
                    <tr key={comp.id}>
                      <td>{new Date(comp.date).toLocaleDateString()}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{comp.student}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{comp.reg}</div>
                      </td>
                      <td>{comp.topic}</td>
                      <td>
                        <span className={`badge ${comp.status}`}>
                          {comp.status}
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
    </div>
  );
};

export default Dashboard;
