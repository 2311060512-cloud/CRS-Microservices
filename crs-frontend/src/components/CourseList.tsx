// path: crs-frontend/src/components/CourseList.tsx
// purpose: cap nhat onEdit/onDelete thanh optional, chi hien cot "Thao tac" khi duoc truyen vao
import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;
}

export default function CourseList({
    courses,
    state,
    errorMessage,
    onRetry,
    onEdit,
    onDelete,
}: CourseListProps) {
    if (state === 'loading') {
        return (
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
                    Đang tải danh sách môn học...
                </p>
            </div>
        );
    }

    if (state === 'error') {
        return (
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
                    {errorMessage}
                </p>
                <button
                    onClick={onRetry}
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
        );
    }

    if (state === 'empty') {
        return (
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
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
                <h4 style={{ color: 'var(--text-main)', margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                    Không tìm thấy môn học nào phù hợp
                </h4>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>
                    Thử tìm kiếm với từ khóa khác hoặc quay lại trang danh sách.
                </p>
            </div>
        );
    }

    const showActions = !!onEdit || !!onDelete;

    return (
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
                                Số tín chỉ
                            </th>
                            <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Chỗ còn lại / Tối đa
                            </th>
                            {showActions && (
                                <th style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                                    Thao tác
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => {
                            const isFull = course.soChoConLai === 0;
                            const percentage = course.soChoToiDa > 0 ? Math.round(((course.soChoToiDa - course.soChoConLai) / course.soChoToiDa) * 100) : 0;

                            return (
                                <tr
                                    key={course.id}
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
                                            {course.tenMonHoc}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                                            Mã ID: #{course.id}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '3px 10px',
                                                borderRadius: 'var(--radius-full)',
                                                backgroundColor: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                fontWeight: 600,
                                                fontSize: '13px',
                                            }}
                                        >
                                            {course.soTinChi} TC
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    color: isFull ? 'var(--danger)' : 'var(--text-main)',
                                                }}
                                            >
                                                {course.soChoConLai} / {course.soChoToiDa}
                                            </span>
                                            {isFull ? (
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        padding: '2px 8px',
                                                        borderRadius: 'var(--radius-full)',
                                                        backgroundColor: 'var(--danger-light)',
                                                        color: 'var(--danger-text)',
                                                    }}
                                                >
                                                    Hết chỗ
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        padding: '2px 8px',
                                                        borderRadius: 'var(--radius-full)',
                                                        backgroundColor: 'var(--success-light)',
                                                        color: 'var(--success-text)',
                                                    }}
                                                >
                                                    Còn {percentage}%
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {showActions && (
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(course)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#fff',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            color: '#2563eb',
                                                            fontWeight: 600,
                                                            fontSize: '13px',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                                                            e.currentTarget.style.borderColor = 'var(--primary-border)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#fff';
                                                            e.currentTarget.style.borderColor = 'var(--border)';
                                                        }}
                                                    >
                                                        ✏️ Sửa
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(course)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#fff',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            color: 'var(--danger-text)',
                                                            fontWeight: 600,
                                                            fontSize: '13px',
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                                                            e.currentTarget.style.borderColor = 'var(--danger-border)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#fff';
                                                            e.currentTarget.style.borderColor = 'var(--border)';
                                                        }}
                                                    >
                                                        🗑️ Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
