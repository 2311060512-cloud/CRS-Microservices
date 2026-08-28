interface PaginationProps {
    currentPage: number; // 0-indexed (khớp với Spring Data Pageable)
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Thuật toán hiển thị số trang thông minh dạng: 1 2 3 ... 8 9 10
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons + 2) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu tiên
            pages.push(0);

            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages - 2, currentPage + 1);

            if (startPage > 1) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 2) {
                pages.push('...');
            }

            // Luôn hiển thị trang cuối cùng
            pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '24px',
                padding: '12px 16px',
                backgroundColor: 'var(--surface-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                Hiển thị trang <strong style={{ color: 'var(--text-main)' }}>{currentPage + 1}</strong> / <strong>{totalPages}</strong>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                    disabled={currentPage === 0}
                    onClick={() => onPageChange(currentPage - 1)}
                    style={{
                        padding: '6px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        backgroundColor: '#fff',
                        color: currentPage === 0 ? 'var(--text-light)' : 'var(--text-main)',
                        cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 0 ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (currentPage !== 0) e.currentTarget.style.backgroundColor = 'var(--surface-card-subtle)';
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage !== 0) e.currentTarget.style.backgroundColor = '#fff';
                    }}
                >
                    ‹ Trước
                </button>

                {getPageNumbers().map((p, index) => {
                    if (p === '...') {
                        return (
                            <span key={`dots-${index}`} style={{ padding: '0 6px', color: 'var(--text-light)', fontSize: '14px' }}>
                                ...
                            </span>
                        );
                    }

                    const pageNum = Number(p);
                    const isActive = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            style={{
                                width: '34px',
                                height: '34px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: isActive ? 700 : 500,
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                                backgroundColor: isActive ? 'var(--primary)' : '#fff',
                                color: isActive ? '#fff' : 'var(--text-main)',
                                cursor: 'pointer',
                                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-card-subtle)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = '#fff';
                            }}
                        >
                            {pageNum + 1}
                        </button>
                    );
                })}

                <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => onPageChange(currentPage + 1)}
                    style={{
                        padding: '6px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        backgroundColor: '#fff',
                        color: currentPage >= totalPages - 1 ? 'var(--text-light)' : 'var(--text-main)',
                        cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage >= totalPages - 1 ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (currentPage < totalPages - 1) e.currentTarget.style.backgroundColor = 'var(--surface-card-subtle)';
                    }}
                    onMouseLeave={(e) => {
                        if (currentPage < totalPages - 1) e.currentTarget.style.backgroundColor = '#fff';
                    }}
                >
                    Sau ›
                </button>
            </div>
        </div>
    );
}
