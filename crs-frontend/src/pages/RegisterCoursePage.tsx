// path: crs-frontend/src/pages/RegisterCoursePage.tsx
// purpose: trang Dang ky hoc phan hoan chinh cho Sinh vien
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { registerCourse } from '../api/registrationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function RegisterCoursePage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [registeringId, setRegisteringId] = useState<number | null>(null);
    const { user } = useAuth();
    const { toast, showToast, clearToast } = useToast();
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = useCallback((newKeyword: string) => {
        setKeyword((prev) => {
            if (prev !== newKeyword) {
                setPage(0);
            }
            return newKeyword;
        });
    }, []);

    const handleRegister = async (course: Course) => {
        if (!user) return;
        setRegisteringId(course.id);
        try {
            await registerCourse({
                studentId: user.id,
                courseId: course.id,
            });
            showToast(`Đăng ký thành công môn "${course.tenMonHoc}"!`, 'success');
            refetch(); // tai lai danh sach de cap nhat so cho con lai moi nhat
        } catch (err) {
            // LUU Y: loi co the den tu registration-service (vi du "da dang ky roi")
            // hoac lan truyen tu course-service (vi du "het cho") - Frontend KHONG can
            // phan biet nguon goc, chi can doc dung truong "message" trong JSON tra ve.
            let message = 'Đăng ký không thành công, vui lòng thử lại.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'var(--bg-main)', padding: '36px 20px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '24px' }}>✍️</span>
                        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>
                            Đăng ký Học phần
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                        Chọn môn học bạn muốn tham gia trong danh sách bên dưới và bấm nút Đăng ký.
                    </p>
                </div>

                {/* Search Bar */}
                <SearchBox onSearch={handleSearch} />

                {/* Table Container */}
                <div style={{ marginTop: '20px' }}>
                    <CourseList
                        courses={courses}
                        state={state}
                        errorMessage={errorMessage}
                        onRetry={refetch}
                        onRegister={handleRegister}
                        registeringId={registeringId}
                    />
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />

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
