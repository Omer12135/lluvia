import React from 'react';

const AdminLogin = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }}>
      <div>
        <h1>Admin Login Test</h1>
        <p>If you can see this, the routing is working!</p>
        <button 
          onClick={() => window.location.href = '/admin/dashboard'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;