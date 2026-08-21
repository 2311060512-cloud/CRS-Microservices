import { useEffect, useState } from 'react';
import { getCourses } from './api/courseApi';
import type { Course } from './types/course';

function App() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCourses()
            .then((res) => {
                console.log('API RESPONSE:', res.data);
                setCourses(res.data.content);
            })
            .catch((err) => {
                console.error('LỖI API:', err);
                console.error('STATUS:', err.response?.status);
                console.error('DATA:', err.response?.data);
                console.error('URL:', err.config?.url);
                console.error('BASE URL:', err.config?.baseURL);

                setError(`Lỗi kết nối API: ${err.message}`);
            });
    }, []);

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            <h1>Kiểm tra kết nối CRS qua Gateway</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <pre>{JSON.stringify(courses, null, 2)}</pre>
        </div>
    );
}

export default App;