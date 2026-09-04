// path: crs-frontend/src/pages/ApiKeysPage.tsx
// purpose: trang quan tri API Key (chi ADMIN) - cap moi, thu hoi, xem danh sach
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getApiKeys, createApiKey, revokeApiKey } from '../api/apiKeyApi';
import type { ApiKey } from '../types/apiKey';
import type { ApiErrorResponse } from '../types/apiError';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [ownerName, setOwnerName] = useState('');
    const [scopes, setScopes] = useState('courses:read');
    const [validDays, setValidDays] = useState('30');
    const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const showToast = (type: 'success' | 'error', text: string) => {
        setToastMessage({ type, text });
        setTimeout(() => setToastMessage(null), 3500);
    };

    const loadKeys = useCallback(() => {
        setLoading(true);
        getApiKeys()
            .then((res) => {
                setKeys(res.data);
                setError(null);
            })
            .catch(() => setError('Không tải được danh sách API Key.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadKeys();
    }, [loadKeys]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setNewKeyValue(null);
        setCopied(false);
        setSubmitting(true);

        try {
            const res = await createApiKey({
                ownerName,
                scopes,
                validDays: validDays ? Number(validDays) : undefined,
            });
            setNewKeyValue(res.data.keyValue); // Hien thi 1 lan duy nhat de Admin copy
            setOwnerName('');
            showToast('success', `Cấp API Key thành công cho đối tác "${res.data.ownerName}"!`);
            loadKeys();
        } catch (err) {
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Cấp API Key không thành công.');
            }
            showToast('error', 'Cấp API Key thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopyKey = () => {
        if (newKeyValue) {
            navigator.clipboard.writeText(newKeyValue);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRevoke = async (key: ApiKey) => {
        if (!window.confirm(`Bạn có chắc muốn thu hồi API Key của "${key.ownerName}"?`)) return;
        try {
            await revokeApiKey(key.id);
            showToast('success', `Đã thu hồi API Key của "${key.ownerName}"!`);
            loadKeys();
        } catch {
            showToast('error', 'Thu hồi không thành công.');
        }
    };

    return (
        <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'var(--bg-main)', padding: '36px 20px' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        zIndex: 9999,
                        padding: '14px 20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: toastMessage.type === 'success' ? '#065f46' : '#991b1b',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 600,
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <span>{toastMessage.type === 'success' ? '✅' : '❌'}</span>
                    <span>{toastMessage.text}</span>
                </div>
            )}

            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Header Section */}
                <div
                    style={{
                        marginBottom: '32px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'var(--danger-text)',
                                backgroundColor: 'var(--danger-light)',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                            }}
                        >
                            Admin Area
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>• Quyền Quản trị viên</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                        🔑 Quản lý API Key Đối tác
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                        Cấp mới, thu hồi tức thời và phân quyền truy cập API theo scope cho các đối tác tích hợp
                    </p>
                </div>

                {/* Form Card */}
                <div
                    style={{
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        marginBottom: '28px',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
                        ➕ Cấp API Key mới
                    </h3>

                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                                    Tên đối tác <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Công ty ABC Edu"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                                    Scopes (phân cách bởi dấu phẩy) <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="courses:read"
                                    value={scopes}
                                    onChange={(e) => setScopes(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                                    Hiệu lực (số ngày, để trống = vĩnh viễn)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="30"
                                    value={validDays}
                                    onChange={(e) => setValidDays(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <p style={{ color: 'var(--danger-text)', fontSize: '13px', marginBottom: '14px', fontWeight: 500 }}>
                                ⚠️ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '10px 22px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.7 : 1,
                                transition: 'var(--transition)',
                            }}
                        >
                            {submitting ? 'Đang cấp key...' : 'Cấp API Key'}
                        </button>
                    </form>
                </div>

                {/* Key Just Created Box */}
                {newKeyValue && (
                    <div
                        style={{
                            backgroundColor: '#fefce8',
                            border: '1px solid #fde047',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px',
                            marginBottom: '28px',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854d0e', marginBottom: '8px' }}>
                            <span style={{ fontSize: '18px' }}>🛡️</span>
                            <strong style={{ fontSize: '15px' }}>
                                Key vừa tạo (chỉ hiển thị 1 lần duy nhất, hãy lưu lại ngay):
                            </strong>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #fef08a',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px 16px',
                            }}
                        >
                            <code
                                style={{
                                    flex: 1,
                                    fontFamily: 'monospace',
                                    fontSize: '15px',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    wordBreak: 'break-all',
                                    userSelect: 'all',
                                }}
                            >
                                {newKeyValue}
                            </code>
                            <button
                                type="button"
                                onClick={handleCopyKey}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: copied ? '#15803d' : '#ca8a04',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {copied ? 'Đã copy!' : 'Sao chép'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Keys Table Card */}
                <div
                    style={{
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Danh sách API Key ({keys.length})
                        </h3>
                        <button
                            onClick={loadKeys}
                            style={{
                                padding: '6px 14px',
                                backgroundColor: 'var(--surface-card-subtle)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                            }}
                        >
                            🔄 Làm mới
                        </button>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>Đang tải danh sách...</p>
                    ) : keys.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                            Chưa có API Key nào được cấp.
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '12px 8px' }}>Đối tác</th>
                                        <th style={{ padding: '12px 8px' }}>Scopes</th>
                                        <th style={{ padding: '12px 8px' }}>Trạng thái</th>
                                        <th style={{ padding: '12px 8px' }}>Hết hạn</th>
                                        <th style={{ padding: '12px 8px' }}>Ngày tạo</th>
                                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keys.map((k) => (
                                        <tr key={k.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '14px 8px', fontWeight: 600, color: 'var(--text-main)' }}>
                                                {k.ownerName}
                                            </td>
                                            <td style={{ padding: '14px 8px' }}>
                                                {k.scopes.split(',').map((s) => (
                                                    <span
                                                        key={s}
                                                        style={{
                                                            display: 'inline-block',
                                                            backgroundColor: 'var(--primary-light)',
                                                            color: 'var(--primary)',
                                                            padding: '2px 8px',
                                                            borderRadius: 'var(--radius-full)',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            marginRight: '4px',
                                                        }}
                                                    >
                                                        {s.trim()}
                                                    </span>
                                                ))}
                                            </td>
                                            <td style={{ padding: '14px 8px' }}>
                                                <span
                                                    style={{
                                                        padding: '4px 10px',
                                                        borderRadius: 'var(--radius-full)',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        backgroundColor: k.status === 'ACTIVE' ? 'var(--success-light)' : 'var(--danger-light)',
                                                        color: k.status === 'ACTIVE' ? 'var(--success-text)' : 'var(--danger-text)',
                                                    }}
                                                >
                                                    {k.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                                                {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                            </td>
                                            <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                                                {new Date(k.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                                                {k.status === 'ACTIVE' ? (
                                                    <button
                                                        onClick={() => handleRevoke(k)}
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
                                                    >
                                                        Thu hồi
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>Đã vô hiệu</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
