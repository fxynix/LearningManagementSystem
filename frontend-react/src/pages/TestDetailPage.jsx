import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestById } from '../api/testApi';
import { Button, Typography, Spin } from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const TestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTestById(id)
            .then(res => setTest(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spin tip="Загрузка..." />;
    if (!test) return <div>Тест не найден</div>;

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Назад
            </Button>
            <Title level={2}>{test.title}</Title>
            <Paragraph>{test.description}</Paragraph>
            <Paragraph><strong>Вопросов:</strong> {test.questionsCount}</Paragraph>
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => navigate(`/tests/${test.id}/pass`)}>
                Пройти тест
            </Button>
        </div>
    );
};

export default TestDetailPage;