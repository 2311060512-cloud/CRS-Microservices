// path: crs-frontend/src/components/CourseForm.tsx
// purpose: form dung chung cho Them va Sua mon hoc, validate phia client truoc khi goi API
import React, { useState, useEffect } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null; // null = dang o che do Them; co gia tri = dang Sua
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

export default function CourseForm({
    editingCourse,
    onSubmit,
    onCancel,
    submitting,
    serverError,
}: CourseFormProps) {
    const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
    const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});

    // Moi lan editingCourse thay doi (bam nut Sua tren 1 dong khac), mo lai du lieu vao form
    useEffect(() => {
        if (editingCourse) {
            setValues({
                tenMonHoc: editingCourse.tenMonHoc,
                soTinChi: String(editingCourse.soTinChi),
                soChoToiDa: String(editingCourse.soChoToiDa),
            });
        } else {
            setValues(emptyCourseForm);
        }
        setClientErrors({});
    }, [editingCourse]);

    const validate = (): boolean => {
        const errors: Partial<CourseFormValues> = {};
        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc = 'Ten mon hoc khong duoc de trong';
        }
        const soTinChi = Number(values.soTinChi);
        if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
            errors.soTinChi = 'So tin chi phai la so lon hon 0';
        }
        const soChoToiDa = Number(values.soChoToiDa);
        if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
            errors.soChoToiDa = 'So cho toi da phai la so lon hon 0';
        }
        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(values);
        // Khi them moi hoac cap nhat thanh cong, xoa trang form va loi cu
        if (!editingCourse) {
            setValues(emptyCourseForm);
            setClientErrors({});
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="animate-fade-in"
            style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                marginBottom: '28px',
                boxShadow: 'var(--shadow-md)',
                transition: 'var(--transition)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: editingCourse ? '#fef3c7' : 'var(--primary-light)',
                            color: editingCourse ? '#d97706' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold',
                        }}
                    >
                        {editingCourse ? '✏️' : '✨'}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {editingCourse ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
                        </h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                            {editingCourse ? `Đang chỉnh sửa: #${editingCourse.id} - ${editingCourse.tenMonHoc}` : 'Nhập thông tin môn học vào form bên dưới'}
                        </p>
                    </div>
                </div>
                {editingCourse && (
                    <span
                        style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: '#fef3c7',
                            color: '#b45309',
                        }}
                    >
                        Chế độ chỉnh sửa
                    </span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Ten mon hoc */}
                <div style={{ gridColumn: 'span 1' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Tên môn học <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="VD: Nhập môn Lập trình Web"
                        value={values.tenMonHoc}
                        onChange={(e) => setValues({ ...values, tenMonHoc: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '14px',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${clientErrors.tenMonHoc ? 'var(--danger)' : 'var(--border)'}`,
                            outline: 'none',
                            backgroundColor: '#fff',
                        }}
                        onFocus={(e) => {
                            if (!clientErrors.tenMonHoc) e.target.style.borderColor = 'var(--border-focus)';
                        }}
                        onBlur={(e) => {
                            if (!clientErrors.tenMonHoc) e.target.style.borderColor = 'var(--border)';
                        }}
                    />
                    {clientErrors.tenMonHoc && (
                        <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>⚠️</span> {clientErrors.tenMonHoc}
                        </p>
                    )}
                </div>

                {/* So tin chi */}
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Số tín chỉ <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="VD: 3"
                        min="1"
                        value={values.soTinChi}
                        onChange={(e) => setValues({ ...values, soTinChi: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '14px',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${clientErrors.soTinChi ? 'var(--danger)' : 'var(--border)'}`,
                            outline: 'none',
                            backgroundColor: '#fff',
                        }}
                        onFocus={(e) => {
                            if (!clientErrors.soTinChi) e.target.style.borderColor = 'var(--border-focus)';
                        }}
                        onBlur={(e) => {
                            if (!clientErrors.soTinChi) e.target.style.borderColor = 'var(--border)';
                        }}
                    />
                    {clientErrors.soTinChi && (
                        <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>⚠️</span> {clientErrors.soTinChi}
                        </p>
                    )}
                </div>

                {/* So cho toi da */}
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Số chỗ tối đa <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="VD: 50"
                        min="1"
                        value={values.soChoToiDa}
                        onChange={(e) => setValues({ ...values, soChoToiDa: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            fontSize: '14px',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${clientErrors.soChoToiDa ? 'var(--danger)' : 'var(--border)'}`,
                            outline: 'none',
                            backgroundColor: '#fff',
                        }}
                        onFocus={(e) => {
                            if (!clientErrors.soChoToiDa) e.target.style.borderColor = 'var(--border-focus)';
                        }}
                        onBlur={(e) => {
                            if (!clientErrors.soChoToiDa) e.target.style.borderColor = 'var(--border)';
                        }}
                    />
                    {clientErrors.soChoToiDa && (
                        <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>⚠️</span> {clientErrors.soChoToiDa}
                        </p>
                    )}
                </div>
            </div>

            {serverError && (
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
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span style={{ fontSize: '16px' }}>🚨</span>
                    <span>{serverError}</span>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '10px 22px',
                        backgroundColor: submitting ? 'var(--text-light)' : (editingCourse ? '#2563eb' : 'var(--primary)'),
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '14px',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                        if (!submitting) {
                            e.currentTarget.style.backgroundColor = editingCourse ? '#1d4ed8' : 'var(--primary-hover)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!submitting) {
                            e.currentTarget.style.backgroundColor = editingCourse ? '#2563eb' : 'var(--primary)';
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }
                    }}
                >
                    {submitting ? '⏳ Đang lưu...' : (editingCourse ? '💾 Cập nhật môn học' : '➕ Thêm mới')}
                </button>

                {editingCourse && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        style={{
                            padding: '10px 18px',
                            backgroundColor: '#fff',
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                            fontSize: '14px',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-card-subtle)';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}
