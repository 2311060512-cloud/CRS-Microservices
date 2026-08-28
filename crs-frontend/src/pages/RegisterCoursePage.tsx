// path: crs-frontend/src/pages/RegisterCoursePage.tsx
// purpose: khung trang tam thoi cho Buoi 9 - buoi nay chi tao route va bao ve bang ProtectedRoute
import { useAuth } from '../context/AuthContext';

export default function RegisterCoursePage() {
    const { user } = useAuth();

    return (
        <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'var(--bg-main)', padding: '36px 20px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                <div
                    className="animate-fade-in"
                    style={{
                        backgroundColor: 'var(--surface-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        padding: '40px 32px',
                        boxShadow: 'var(--shadow-md)',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                        Cổng Đăng ký Học phần (Sinh viên)
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px auto' }}>
                        Xin chào <strong>{user?.username}</strong>! Tính năng đăng ký và hủy đăng ký học phần trực tuyến sẽ được hoàn thiện đầy đủ ở <strong>Buổi 9</strong>.
                    </p>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--success-light)',
                            color: 'var(--success-text)',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '13px',
                            fontWeight: 600,
                        }}
                    >
                        <span>🔒 Tuyến đường này đã được bảo vệ thành công bởi ProtectedRoute (Role: STUDENT)</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
