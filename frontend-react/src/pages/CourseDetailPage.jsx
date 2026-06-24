import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../api/courseApi';
import { getLectures } from '../api/lectureApi';
import { getTests } from '../api/testApi';
import { useAuth } from '../context/AuthContext';
import { Button, List, Typography, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [courseRes, lecturesRes, testsRes] = await Promise.all([
                    getCourseById(id),
                    getLectures({ courseId: id, userId: user.id, roles: user.roles, size: 100 }),
                    getTests({ courseId: id, userId: user.id, roles: user.roles, size: 100 }),
                ]);
                setCourse(courseRes.data);
                setLectures(lecturesRes?.data?.content || []);
                setTests(testsRes?.data?.content || []);
            } catch (error) {
                console.error(error);
                message.error('Не удалось загрузить данные курса');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    if (loading) return <Spin tip="Загрузка..." />;
    if (!course) return <div>Курс не найден</div>;

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Назад
            </Button>
            <Title level={2}>{course.title}</Title>
            <p><strong>Преподаватель:</strong> {course.teacher?.fullName || 'Не указан'}</p>
            <p>{course.description}</p>

            <Title level={4}>Лекции</Title>
            {lectures.length === 0 ? (
                <p>Нет лекций</p>
            ) : (
                <List
                    dataSource={lectures}
                    renderItem={lecture => (
                        <List.Item>
                            <Link to={`/lectures/${lecture.id}`}>{lecture.title}</Link>
                        </List.Item>
                    )}
                />
            )}

            <Title level={4}>Тесты</Title>
            {tests.length === 0 ? (
                <p>Нет тестов</p>
            ) : (
                <List
                    dataSource={tests}
                    renderItem={test => (
                        <List.Item>
                            <Link to={`/tests/${test.id}`}>{test.title}</Link>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default CourseDetailPage;