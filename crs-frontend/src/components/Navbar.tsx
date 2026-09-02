// path: crs-frontend/src/components/Navbar.tsx
// purpose: thanh dieu huong, hien thi menu khac nhau tuy theo trang thai dang nhap va role
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const linkStyle = (path: string) => ({
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive(path) ? 700 : 500,
        color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isActive(path) ? 'var(--primary-light)' : 'transparent',
        transition: 'var(--transition)',
    });

    return (
        <header
            style={{
                backgroundColor: 'var(--surface-card)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <div
                style={{
                    maxWidth: '1080px',
                    margin: '0 auto',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                {/* Brand / Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link
                        to="/courses"
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 800,
                            fontSize: '18px',
                            color: 'var(--text-main)',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        <span
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: 800,
                            }}
                        >
                            C
                        </span>
                        <span>CRS Portal</span>
                    </Link>

                    {/* Nav Links */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link to="/courses" style={linkStyle('/courses')}>
                            📚 Danh sách môn học
                        </Link>

                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin/courses" style={linkStyle('/admin/courses')}>
                                ⚙️ Quản trị môn học
                            </Link>
                        )}

                        {isAuthenticated && user?.role === 'STUDENT' && (
                            <>
                                <Link to="/register-course" style={linkStyle('/register-course')}>
                                    ✍️ Đăng ký học phần
                                </Link>
                                <Link to="/my-registrations" style={linkStyle('/my-registrations')}>
                                    📋 Môn học đã đăng ký
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* User / Auth status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isAuthenticated && user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '4px 12px 4px 6px',
                                    backgroundColor: 'var(--surface-card-subtle)',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--border)',
                                }}
                            >
                                <span
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        backgroundColor: user.role === 'ADMIN' ? '#dbeafe' : '#dcfce7',
                                        color: user.role === 'ADMIN' ? '#1e40af' : '#166534',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                    }}
                                >
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                                    {user.username}
                                </span>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)',
                                        backgroundColor: user.role === 'ADMIN' ? '#fee2e2' : '#fef3c7',
                                        color: user.role === 'ADMIN' ? '#991b1b' : '#92400e',
                                    }}
                                >
                                    {user.role}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--danger-text)',
                                    backgroundColor: '#fff',
                                    border: '1px solid var(--danger-border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fff';
                                }}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            style={{
                                textDecoration: 'none',
                                padding: '8px 18px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#fff',
                                backgroundColor: 'var(--primary)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'var(--transition)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--primary)';
                            }}
                        >
                            🔐 Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
