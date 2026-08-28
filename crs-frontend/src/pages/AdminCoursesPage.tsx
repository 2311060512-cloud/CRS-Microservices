// path: crs-frontend/src/pages/AdminCoursesPage.tsx
// purpose: rap CourseForm + CourseList + Pagination + SearchBox, xu ly Them/Sua/Xoa
// va dong bo lai danh sach (refetch) sau moi thao tac thanh cong
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { createCourse, updateCourse, deleteCourse } from '../api/courseApi';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import CourseForm from '../components/CourseForm';
import type { Course, CourseFormValues } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function AdminCoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const showToast = (type: 'success' | 'error', text: string) => {
        setToastMessage({ type, text });
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleSearch = useCallback((newKeyword: string) => {
        setKeyword((prev) => {
            if (prev !== newKeyword) {
                setPage(0);
            }
            return newKeyword;
        });
    }, []);

    const extractErrorMessage = (err: unknown): string => {
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
            const data = err.response?.data;
            if (data?.message) return data.message;
            if (data) {
                const firstFieldError = Object.values(data).find((v) => typeof v === 'string');
                if (firstFieldError) return firstFieldError;
            }
            if (err.response?.status === 401) {
                return 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn (401).';
            }
            if (err.response?.status === 403) {
                return 'Bạn không có quyền thực hiện thao tác này (403 - Cần quyền ROLE_ADMIN).';
            }
        }
        return 'Đã xảy ra lỗi, vui lòng thử lại.';
    };

    const handleFormSubmit = async (values: CourseFormValues) => {
        setSubmitting(true);
        setFormError(null);
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, values);
                showToast('success', `Cập nhật môn học "${values.tenMonHoc}" thành công!`);
            } else {
                await createCourse(values);
                showToast('success', `Thêm môn học "${values.tenMonHoc}" thành công!`);
            }
            setEditingCourse(null);
            refetch();
        } catch (err) {
            setFormError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (course: Course) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa môn học "${course.tenMonHoc}"?`)) return;
        try {
            await deleteCourse(course.id);
            showToast('success', `Đã xóa môn học "${course.tenMonHoc}" thành công!`);
            refetch();
        } catch (err) {
            showToast('error', extractErrorMessage(err));
        }
    };

    return (
        <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'var(--bg-main)', padding: '36px 20px' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    className="animate-fade-in"
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginBottom: '32px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid var(--border)',
                    }}
                >
                    <div>
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
                            Quản lý Môn học (Admin)
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                            Thêm mới, sửa thông tin, xóa môn học và theo dõi sĩ số sinh viên đăng ký
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <CourseForm
                    editingCourse={editingCourse}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setEditingCourse(null)}
                    submitting={submitting}
                    serverError={formError}
                />

                {/* Search & Filter Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginBottom: '20px',
                    }}
                >
                    <SearchBox onSearch={handleSearch} />
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Tổng số môn: <strong style={{ color: 'var(--text-main)' }}>{courses.length}</strong> trên trang hiện tại
                    </div>
                </div>

                {/* Table Data */}
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
                    onEdit={(course) => {
                        setEditingCourse(course);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDelete={handleDelete}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </main>
    );
}
