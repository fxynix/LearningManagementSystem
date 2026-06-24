import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestById } from '../api/testApi';
import { getTestAttempts, createTestAttempt, updateTestAttempt } from '../api/testAttemptApi';
import { useAuth } from '../context/AuthContext';
import { parseGift } from '../utils/giftParser';
import { Button, Typography, Radio, Checkbox, Input, Space, message, Spin, Card, Divider, Alert, Progress } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const TestPassPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [attemptId, setAttemptId] = useState(null);
    const initialized = useRef(false);
    const testIdNumber = parseInt(id);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const initTest = async () => {
            try {
                const testRes = await getTestById(testIdNumber);
                setTest(testRes.data);
                const parsed = parseGift(testRes.data.content);
                setQuestions(parsed);
                const initialAnswers = {};
                parsed.forEach((q, idx) => {
                    if (q.type === 'short' || q.type === 'numeric' || q.type === 'essay') {
                        initialAnswers[idx] = '';
                    } else if (q.type === 'choice') {
                        initialAnswers[idx] = null;
                    } else if (q.type === 'multi') {
                        initialAnswers[idx] = [];
                    }
                });
                setAnswers(initialAnswers);

                const rolesString = user.roles ? user.roles.join(',') : '';
                const attemptsRes = await getTestAttempts({
                    testId: testIdNumber,
                    userId: user.id,
                    currentUserId: user.id,
                    roles: rolesString,
                    size: 10000
                });
                const attempts = attemptsRes.data.content || [];
                let inProgress = attempts.find(a => a.status === 'IN_PROGRESS');

                if (inProgress) {
                    setAttemptId(inProgress.id);
                    message.info('Продолжаем предыдущую попытку');
                } else {
                    const attemptNumber = attempts.length > 0 ? Math.max(...attempts.map(a => a.attemptNumber)) + 1 : 1;
                    const attemptData = {
                        testId: testIdNumber,
                        userId: user.id,
                        attemptNumber,
                        startTime: new Date().toISOString(),
                        endTime: null,
                        score: null,
                        status: 'IN_PROGRESS'
                    };
                    try {
                        const response = await createTestAttempt(attemptData);
                        const newAttempt = response.data || response;
                        setAttemptId(newAttempt.id);
                        message.success('Начат новый тест');
                    } catch (err) {
                        if (err.response?.status === 409 || err.message?.includes('duplicate')) {
                            const refreshAttempts = await getTestAttempts({
                                testId: testIdNumber,
                                userId: user.id,
                                currentUserId: user.id,
                                roles: rolesString,
                                size: 10000
                            });
                            const all = refreshAttempts.data.content || [];
                            const existing = all.find(a => a.status === 'IN_PROGRESS');
                            if (existing) {
                                setAttemptId(existing.id);
                                message.info('Продолжаем предыдущую попытку');
                            } else {
                                message.error('Не удалось создать попытку: конфликт');
                                setLoading(false);
                                return;
                            }
                        } else {
                            const errorMsg = err.response?.data?.message || err.message || 'Не удалось создать попытку';
                            message.error(errorMsg);
                            console.error(err);
                            setLoading(false);
                            return;
                        }
                    }
                }
            } catch (error) {
                message.error('Ошибка загрузки теста');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        initTest();
    }, [testIdNumber, user]);

    const handleAnswerChange = (index, value) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleMultiChange = (index, checkedValues) => {
        setAnswers(prev => ({ ...prev, [index]: checkedValues }));
    };

    const handleShortChange = (index, e) => {
        setAnswers(prev => ({ ...prev, [index]: e.target.value }));
    };

    const renderQuestion = (q, idx) => {
        if (q.type === 'choice') {
            return (
                <Radio.Group
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    value={answers[idx]}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {q.options.map((opt, i) => (
                            <Radio key={i} value={opt.text}>{opt.text}</Radio>
                        ))}
                    </Space>
                </Radio.Group>
            );
        }
        if (q.type === 'multi') {
            return (
                <Checkbox.Group
                    onChange={(checkedValues) => handleMultiChange(idx, checkedValues)}
                    value={answers[idx] || []}
                    style={{ width: '100%' }}
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {q.options.map((opt, i) => (
                            <Checkbox key={i} value={opt.text}>{opt.text}</Checkbox>
                        ))}
                    </Space>
                </Checkbox.Group>
            );
        }
        if (q.type === 'short' || q.type === 'numeric') {
            return (
                <Input
                    placeholder="Введите ответ"
                    value={answers[idx] || ''}
                    onChange={(e) => handleShortChange(idx, e)}
                />
            );
        }
        if (q.type === 'essay') {
            return (
                <Input.TextArea
                    rows={4}
                    placeholder="Введите развернутый ответ"
                    value={answers[idx] || ''}
                    onChange={(e) => handleShortChange(idx, e)}
                />
            );
        }
        return <div>Неизвестный тип вопроса</div>;
    };

    const handleSubmit = async () => {
        let correctCount = 0;
        let totalQuestions = questions.length;
        questions.forEach((q, idx) => {
            const userAnswer = answers[idx];
            if (q.type === 'choice') {
                const correctOption = q.options.find(opt => opt.correct);
                if (correctOption && userAnswer === correctOption.text) {
                    correctCount++;
                }
            } else if (q.type === 'multi') {
                const correctOptions = q.options.filter(opt => opt.correct).map(opt => opt.text);
                const userOptions = userAnswer || [];
                const sortedCorrect = [...correctOptions].sort();
                const sortedUser = [...userOptions].sort();
                if (JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser)) {
                    correctCount++;
                }
            } else if (q.type === 'short' || q.type === 'numeric') {
                if (q.correct && userAnswer && userAnswer.trim().toLowerCase() === q.correct.toLowerCase()) {
                    correctCount++;
                }
            } else if (q.type === 'essay') {
                if (userAnswer && userAnswer.trim() !== '') {
                    correctCount++;
                }
            }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);

        setSubmitting(true);
        try {
            await updateTestAttempt(attemptId, {
                endTime: new Date().toISOString(),
                score: score,
                status: 'COMPLETED'
            });
            message.success(`Тест завершён! Вы набрали ${score}%`);
            navigate(`/tests/${testIdNumber}`);
        } catch (error) {
            message.error('Ошибка сохранения результатов');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Spin tip="Загрузка..." />;
    if (!test) return <div>Тест не найден</div>;
    if (!attemptId) return <div>Не удалось начать тест</div>;

    const currentQuestion = questions[currentIndex];

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Назад
            </Button>
            <Title level={2}>{test.title}</Title>
            <Paragraph>{test.description}</Paragraph>
            <Divider />
            {questions.length === 0 ? (
                <Alert message="В этом тесте нет вопросов" type="info" />
            ) : (
                <>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Вопрос {currentIndex + 1} из {questions.length}</strong>
                    </div>
                    <Card>
                        <Paragraph strong>{currentQuestion.question}</Paragraph>
                        {renderQuestion(currentQuestion, currentIndex)}
                    </Card>
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                            disabled={currentIndex === 0}
                        >
                            Назад
                        </Button>
                        {currentIndex < questions.length - 1 ? (
                            <Button type="primary" onClick={() => setCurrentIndex(prev => prev + 1)}>
                                Далее
                            </Button>
                        ) : (
                            <Button type="primary" loading={submitting} onClick={handleSubmit}>
                                Завершить тест
                            </Button>
                        )}
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Progress percent={Math.round((currentIndex + 1) / questions.length * 100)} />
                    </div>
                </>
            )}
        </div>
    );
};

export default TestPassPage;