// path: crs-frontend/src/hooks/useToast.ts
// purpose: hook giup quan ly Toast tu bat ky trang nao ma khong can lap lai state
import { useState, useCallback } from 'react';

export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    }, []);

    const clearToast = useCallback(() => setToast(null), []);

    return { toast, showToast, clearToast };
}
