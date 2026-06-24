import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import { List, Card, Typography, Spin } from 'antd';

const { Title } = Typography;

const CoursesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = {
                    userId: user.id,
                    roles: user.roles,
                    size: 100,
                };
                const res = await getCourses(params);
                setCourses(res.data.content);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user]);

    if (loading) return <Spin tip="Загрузка..." />;

    const grouped = courses.reduce((acc, course) => {
        const catName = course.category?.name || 'Без категории';
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(course);
        return acc;
    }, {});

    return (
        <div>
            <Title level={2}>Доступные курсы</Title>
            {Object.keys(grouped).length === 0 && <p>Нет доступных курсов</p>}
            {Object.entries(grouped).map(([category, items]) => (
                <div key={category} style={{ marginBottom: 24 }}>
                    <Title level={4}>{category}</Title>
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={items}
                        renderItem={course => (
                            <List.Item>
                                <Card
                                    hoverable
                                    onClick={() => navigate(`/courses/${course.id}`)}
                                    title={course.title}
                                >
                                    {course.description}
                                    <br />
                                    <strong>Преподаватель:</strong> {course.teacher?.fullName || 'Не указан'}
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            ))}
        </div>
    );
};

export default CoursesPage;