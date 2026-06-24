import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLectureById } from '../api/lectureApi';
import { Button, Typography, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { decodeHtml } from '../utils/decoding';

const { Title, Paragraph } = Typography;

const LectureDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLectureById(id)
            .then(res => setLecture(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spin tip="Загрузка..." />;
    if (!lecture) return <div>Лекция не найдена</div>;

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Назад
            </Button>
            <Title level={2}>{lecture.title}</Title>
            <Paragraph>
                <div dangerouslySetInnerHTML={{ __html: decodeHtml(lecture.content) }} />
            </Paragraph>
        </div>
    );
};

export default LectureDetailPage;