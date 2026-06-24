import React, { useEffect, useState } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { getCategoryById } from '../api/categoryApi';
import { getCourses } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import { Button, List, Card, Typography, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CategoryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [category, setCategory] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, coursesRes] = await Promise.all([
                    getCategoryById(id),
                    getCourses({
                        categoryId: id,
                        userId: user.id,
                        roles: user.roles,
                        size: 100,
                    }),
                ]);
                setCategory(catRes.data);
                setCourses(coursesRes.data.content);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    if (loading) return <Spin tip="Загрузка..." />;
    if (!category) return <div>Категория не найдена</div>;

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Назад
            </Button>
            <Title level={2}>{category.name}</Title>
            <p>{category.description}</p>
            <Title level={4}>Курсы в этой категории</Title>
            {courses.length === 0 ? (
                <p>В этой категории нет курсов</p>
            ) : (
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={courses}
                    renderItem={course => (
                        <List.Item>
                            <Card
                                hoverable
                                onClick={() => navigate(`/courses/${course.id}`)}
                                title={<Link to={`/courses/${course.id}`}>{course.title}</Link>}
                            >
                                {course.description}
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default CategoryDetailPage;