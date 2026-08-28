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

    const buttonStyle = {
        padding: '6px 12px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        background: '#fff',
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20 }}>
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                style={{
                    ...buttonStyle,
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 0 ? 0.5 : 1,
                }}
            >
                « Trang trước
            </button>

            {getPageNumbers().map((p, index) => {
                if (p === '...') {
                    return (
                        <span key={`dots-${index}`} style={{ padding: '0 4px', color: '#666' }}>
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
                            ...buttonStyle,
                            fontWeight: isActive ? 'bold' : 'normal',
                            backgroundColor: isActive ? '#2563eb' : '#fff',
                            color: isActive ? '#fff' : '#000',
                            borderColor: isActive ? '#2563eb' : '#ccc',
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
                    ...buttonStyle,
                    cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage >= totalPages - 1 ? 0.5 : 1,
                }}
            >
                Trang sau »
            </button>

            <span style={{ marginLeft: 12, fontSize: 13, color: '#666' }}>
                Trang {currentPage + 1} / {totalPages}
            </span>
        </div>
    );
}
