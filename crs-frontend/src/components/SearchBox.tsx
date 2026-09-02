import { useState, useEffect, useRef } from 'react';

interface SearchBoxProps {
    onSearch: (keyword: string) => void;
    placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder }: SearchBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            onSearchRef.current(inputValue.trim());
        }, 400);
        return () => clearTimeout(timer); // huy timer cu moi lan inputValue thay doi
    }, [inputValue]);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
            <span
                style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                    fontSize: '16px',
                    pointerEvents: 'none',
                }}
            >
                🔍
            </span>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder ?? 'Tìm kiếm theo tên môn học...'}
                style={{
                    width: '100%',
                    padding: '11px 16px 11px 40px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--border-focus)';
                    e.target.style.boxShadow = '0 0 0 3px var(--primary-light)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
            />
            {inputValue && (
                <button
                    type="button"
                    onClick={() => setInputValue('')}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-light)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '4px',
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
