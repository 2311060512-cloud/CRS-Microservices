// path: crs-frontend/src/pages/LoginPage.tsx
// purpose: trang dang nhap, goi POST /api/auth/login, luu vao AuthContext roi dieu huong
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await loginApi({ username: username.trim(), password });
            login(res.data);
            if (res.data.role === 'ADMIN') {
                navigate('/admin/courses');
            } else {
                navigate('/courses');
            }
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Sai username hoặc password, vui lòng thử lại.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            style={{
                minHeight: 'calc(100vh - 70px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: 'var(--bg-main)',
            }}
        >
            <div
                className="animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '36px 28px',
                    boxShadow: 'var(--shadow-xl)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            marginBottom: '12px',
                        }}
                    >
                        🔐
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                        Đăng nhập hệ thống CRS
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        Sử dụng tài khoản Admin hoặc Sinh viên để tiếp tục
                    </p>
                </div>

                {error && (
                    <div
                        className="animate-fade-in"
                        style={{
                            padding: '12px 16px',
                            backgroundColor: 'var(--danger-light)',
                            border: '1px solid var(--danger-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--danger-text)',
                            fontSize: '13px',
                            fontWeight: 500,
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            placeholder="admin hoặc student1"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '11px 14px',
                                fontSize: '14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1.5px solid var(--border)',
                                outline: 'none',
                                backgroundColor: '#fff',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--border-focus)';
                                e.target.style.boxShadow = '0 0 0 3px var(--primary-light)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '11px 14px',
                                fontSize: '14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1.5px solid var(--border)',
                                outline: 'none',
                                backgroundColor: '#fff',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--border-focus)';
                                e.target.style.boxShadow = '0 0 0 3px var(--primary-light)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: submitting ? 'var(--text-light)' : 'var(--primary)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '14px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => {
                            if (!submitting) e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                        }}
                        onMouseLeave={(e) => {
                            if (!submitting) e.currentTarget.style.backgroundColor = 'var(--primary)';
                        }}
                    >
                        {submitting ? '⏳ Đang xác thực...' : '🚀 Đăng nhập'}
                    </button>
                </form>

                {/* Hints */}
                <div
                    style={{
                        marginTop: '24px',
                        padding: '12px',
                        backgroundColor: 'var(--surface-card-subtle)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: '2px', color: 'var(--text-main)' }}>💡 Tài khoản mẫu hệ thống:</div>
                    <div>• <strong>Admin:</strong> <code>admin</code> / <code>admin123</code></div>
                    <div>• <strong>Sinh viên:</strong> <code>student1</code> / <code>student123</code></div>
                </div>
            </div>
        </div>
    );
}
