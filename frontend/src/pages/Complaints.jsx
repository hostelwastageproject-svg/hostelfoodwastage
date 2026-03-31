import { useState } from 'react';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 101, student: 'Alice Johnson', reg: 'REG001', topic: 'Food Quality', issue: 'The dinner yesterday was extremely cold.', status: 'pending', date: '2026-03-28' },
    { id: 102, student: 'Bob Smith', reg: 'REG045', topic: 'Quantity Issue', issue: 'Portion size for breakfast was too small.', status: 'resolved', date: '2026-03-27' },
  ]);

  return (
    <div className="page-wrapper">
      <h1 className="page-title">User Complaints</h1>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(comp => (
                <tr key={comp.id}>
                  <td style={{ fontWeight: 600 }}>#{comp.id}</td>
                  <td>
                    <div>{comp.student}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{comp.reg}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{comp.topic}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comp.issue}</div>
                  </td>
                  <td>
                    <span className={`badge ${comp.status}`}>
                      {comp.status === 'pending' && <Clock size={12} style={{ marginRight: '4px', display: 'inline' }} />}
                      {comp.status === 'resolved' && <CheckCircle size={12} style={{ marginRight: '4px', display: 'inline' }} />}
                      {comp.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
