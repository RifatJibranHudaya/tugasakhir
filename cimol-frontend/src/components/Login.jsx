// src/components/Login.jsx

import React, { useState } from 'react';
import api from '../services/api'; 

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/login', { email, password });
            
            console.log('Login berhasil:', response.data);
            
            const { user, token } = response.data;
            
            onLoginSuccess(user, token); 

        } catch (err) {
            console.error("Login Gagal:", err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Kredensial tidak valid atau server error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Admin Login</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: 'darkgreen', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Memuat...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;