import React, { useState } from 'react';
import { API_BASE_URL } from './config';
import './Login.css'; // Reuse login styles

const ResetPassword = ({ uid, token, onComplete }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/password-reset-confirm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onComplete();
                }, 3000);
            } else {
                setError(data.message || 'Reset failed. The link may have expired.');
            }
        } catch (error) {
            console.error('Reset confirm error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-screen">
                <main className="login-main">
                    <div className="login-card" style={{ textAlign: 'center' }}>
                        <div style={{ color: '#16A34A', fontSize: '3rem', marginBottom: '20px' }}>✓</div>
                        <h2 className="welcome-text">Password Reset!</h2>
                        <p className="subtitle">Your password has been updated successfully. Redirecting you to login...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="login-screen">
            <header className="login-header">
                <div className="logo-container">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="8" fill="#DDEAFE" />
                        <path d="M20 10V30" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                        <path d="M10 20H30" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                </div>
                <div className="header-text">
                    <h1>Wound Assessment Tool</h1>
                    <p>Hospital - Grade Diagnostics</p>
                </div>
            </header>

            <main className="login-main">
                <div className="login-card">
                    <div className="lock-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>

                    <h2 className="welcome-text">Set New Password</h2>
                    <p className="subtitle">Please enter your new password below.</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;
