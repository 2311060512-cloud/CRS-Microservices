// path: crs-frontend/src/components/Toast.tsx
// purpose: component thong bao noi (toast) dung chung cho ca he thong, tu dong bien mat sau vai giay
import { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div
            className="animate-fade-in"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                backgroundColor: isSuccess ? '#059669' : '#dc2626',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '280px',
                maxWidth: '450px',
                fontWeight: 500,
                fontSize: '14px',
                border: isSuccess ? '1px solid #10b981' : '1px solid #ef4444',
            }}
        >
            <span style={{ fontSize: '18px' }}>
                {isSuccess ? '✅' : '⚠️'}
            </span>
            <span style={{ flex: 1, wordBreak: 'break-word' }}>
                {message}
            </span>
            <button
                onClick={onClose}
                aria-label="Đóng thông báo"
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '2px 6px',
                    opacity: 0.85,
                    borderRadius: 'var(--radius-sm)',
                    transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.85';
                }}
            >
                ✕
            </button>
        </div>
    );
}
