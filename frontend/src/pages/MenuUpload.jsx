import { useState } from 'react';
import { FileUp, FileText, CheckCircle, Trash2 } from 'lucide-react';

const MenuUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock previous menu
  const currentMenu = {
    name: 'February_Menu_v2.pdf',
    date: '2026-02-01',
    size: '1.2 MB'
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      setFile(null);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Menu Upload</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Upload Section */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Upload New Menu</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Upload the weekly or monthly food menu in PDF format.</p>
          
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '40px 20px', 
              textAlign: 'center',
              backgroundColor: file ? 'var(--brand-light)' : 'transparent',
              borderColor: file ? 'var(--brand-primary)' : 'var(--border-color)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('menu-file').click()}
          >
            <input type="file" id="menu-file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FileUp size={24} />
            </div>
            
            {file ? (
              <div>
                <div style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{file.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 500 }}>Click to upload or drag and drop</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>PDF (max. 5MB)</div>
              </div>
            )}
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '24px' }} 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Publish Menu'}
          </button>
          
          {success && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <CheckCircle size={16} /> Menu published successfully
            </div>
          )}
        </div>

        {/* Current Menu Section */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Current Menu Configured</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}>
              <FileText size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{currentMenu.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Uploaded on {currentMenu.date} • {currentMenu.size}</div>
            </div>
            <button style={{ padding: '8px', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', borderRadius: '4px' }} title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MenuUpload;
