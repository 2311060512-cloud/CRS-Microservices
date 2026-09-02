// path: crs-frontend/src/pages/MyRegistrationsPage.tsx
// purpose: trang "Mon hoc da dang ky" - lay danh sach dang ky roi tu ghep them ten mon hoc, cho phep huy dang ky
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration } from '../api/registrationApi';
import { getCourseById } from '../api/courseApi';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import type { Registration } from '../types/registration';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

interface RegistrationRow extends Registration {
    courseName: string;
}

export default function MyRegistrationsPage() {
    const [rows, setRows] = useState<RegistrationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const { toast, showToast, clearToast } = useToast();

    const loadData = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await getMyRegistrations();
            const activeRegistrations = res.data.filter((r) => r.trangThai === 'DA_DANG_KY');

            // Ghep ten mon hoc cho tung dong - goi song song bang Promise.all cho nhanh
            const enriched = await Promise.all(
                activeRegistrations.map(async (reg) => {
                    try {
                        const courseRes = await getCourseById(reg.courseId);
                        return {
                            ...reg,
                            courseName: (courseRes.data as Course).tenMonHoc,
                        };
                    } catch {
                        // Neu khong lay duoc ten mon (vi du mon da bi Admin xoa), van hien dong nay voi ten mac dinh
                        return {
                            ...reg,
                            courseName: `Môn học #${reg.courseId} (không tìm thấy thông tin)`,
                        };
                    }
                })
            );
            setRows(enriched);
        } catch (err) {
            let message = 'Không tải được danh sách đăng ký.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            setLoadError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCancel = async (row: RegistrationRow) => {
        if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký môn "${row.courseName}" không?`)) {
            return;
        }
        setCancellingId(row.id);
        try {
            await cancelRegistration(row.id);
            showToast(`Đã hủy đăng ký môn "${row.courseName}" thành công!`, 'success');
            loadData(); // tai lai danh sach
        } catch (err) {
            let message = 'Hủy đăng ký không thành công.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'var(--bg-main)', padding: '36px 20px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '24px' }}>📋</span>
                        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
                            Môn học đã đăng ký
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                        Danh sách các học phần bạn đã đăng ký trong kỳ. Bạn có thể xem hoặc hủy đăng ký tại đây.
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div
                        style={{
                            backgroundColor: 'var(--surface-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '48px 24px',
                            textAlign: 'center',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                width: '36px',
                                height: '36px',
                                border: '3px solid var(--primary-light)',
                                borderTop: '3px solid var(--primary)',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                                marginBottom: '12px',
                            }}
                        />
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>
                            Đang tải danh sách đăng ký của bạn...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {!loading && loadError && (
                    <div
                        className="animate-fade-in"
                        style={{
                            backgroundColor: 'var(--danger-light)',
                            border: '1px solid var(--danger-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '32px 24px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚠️</div>
                        <h4 style={{ color: 'var(--danger-text)', margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700 }}>
                            Không thể tải dữ liệu
                        </h4>
                        <p style={{ color: 'var(--danger-text)', margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9 }}>
                            {loadError}
                        </p>
                        <button
                            onClick={loadData}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: 'var(--danger)',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '13px',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-sm)',
                            }}
                        >
                            🔄 Thử lại
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !loadError && rows.length === 0 && (
                    <div
                        className="animate-fade-in"
                        style={{
                            backgroundColor: 'var(--surface-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '48px 24px',
                            textAlign: 'center',
                            border: '1px dashed var(--border)',
                        }}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📖</div>
                        <h4 style={{ color: 'var(--text-main)', margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                            Bạn chưa đăng ký môn học nào
                        </h4>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>
                            Hãy chuyển sang trang Đăng ký học phần để chọn môn học phù hợp.
                        </p>
                    </div>
                )}

                {/* Table state */}
                {!loading && !loadError && rows.length > 0 && (
                    <div
                        className="animate-fade-in"
                        style={{
                            backgroundColor: 'var(--surface-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-md)',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr
                                        style={{
                                            backgroundColor: 'var(--surface-card-subtle)',
                                            borderBottom: '1px solid var(--border)',
                                        }}
                                    >
                                        <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Tên môn học
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Ngày đăng ký
                                        </th>
                                        <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => (
                                        <tr
                                            key={row.id}
                                            style={{
                                                borderBottom: '1px solid var(--border)',
                                                transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--surface-card-subtle)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '15px' }}>
                                                    {row.courseName}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                                                    Mã ĐK: #{row.id} • Mã môn: #{row.courseId}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                                {new Date(row.ngayDangKy).toLocaleString('vi-VN')}
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleCancel(row)}
                                                    disabled={cancellingId === row.id}
                                                    style={{
                                                        padding: '6px 14px',
                                                        backgroundColor: '#fff',
                                                        border: '1px solid var(--danger-border)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        color: 'var(--danger-text)',
                                                        fontWeight: 600,
                                                        fontSize: '13px',
                                                        cursor: cancellingId === row.id ? 'not-allowed' : 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        opacity: cancellingId === row.id ? 0.6 : 1,
                                                        transition: 'var(--transition)',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (cancellingId !== row.id) {
                                                            e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (cancellingId !== row.id) {
                                                            e.currentTarget.style.backgroundColor = '#fff';
                                                        }
                                                    }}
                                                >
                                                    {cancellingId === row.id ? '⏳ Đang hủy...' : '🗑️ Hủy đăng ký'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={clearToast}
                    />
                )}
            </div>
        </main>
    );
}
