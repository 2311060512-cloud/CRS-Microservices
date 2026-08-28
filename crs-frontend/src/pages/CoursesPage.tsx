// path: crs-frontend/src/pages/CoursesPage.tsx
// purpose: trang xem danh sach mon hoc cong khai, chuyen tu App.tsx cua Buoi 6 sang,
// KHONG co Form Them/Sua/Xoa (danh cho ca ADMIN va STUDENT xem)
import { useState, useCallback } from 'react';
import { useCourses } from '../api/useCourses';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';

export default function CoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

    const handleSearch = useCallback((newKeyword: string) => {
        setKeyword((prev) => {
            if (prev !== newKeyword) {
                setPage(0);
            }
            return newKeyword;
        });
    }, []);

    return (
        <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'var(--bg-main)', padding: '36px 20px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'var(--primary)',
                                backgroundColor: 'var(--primary-light)',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                            }}
                        >
                            Tra cứu học phần
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>• Thông tin công khai</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                        Danh sách Môn học
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                        Xem thông tin các môn học, số tín chỉ và số chỗ còn lại mở cho kỳ học hiện tại
                    </p>
                </div>

                {/* Search & Meta */}
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
                        Tìm thấy <strong style={{ color: 'var(--text-main)' }}>{courses.length}</strong> môn trên trang này
                    </div>
                </div>

                {/* Course List */}
                <CourseList
                    courses={courses}
                    state={state}
                    errorMessage={errorMessage}
                    onRetry={refetch}
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
