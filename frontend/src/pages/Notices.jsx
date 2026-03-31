import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState([
    { id: 1, title: 'Easter Special Lunch', content: 'Special lunch will be served on Easter Sunday. Regular meal bookings will automatically upgrade.', date: '2026-03-25' },
    { id: 2, title: 'Cafeteria Maintenance', content: 'The cafeteria will be closed for 2 hours during evening tea time on Wednesday.', date: '2026-03-20' },
  ]);

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Notice Board</h1>
        <button className="btn-primary">
          <Plus size={18} /> New Notice
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notices.map(notice => (
          <div key={notice.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{notice.title}</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '6px', color: 'var(--brand-primary)', background: 'var(--brand-light)', borderRadius: '4px' }}><Edit2 size={16} /></button>
                <button style={{ padding: '6px', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}><Trash2 size={16} /></button>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>{notice.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
              <Calendar size={14} /> Posted on {notice.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;
