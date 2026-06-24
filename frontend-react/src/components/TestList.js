import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getTests, createTest, updateTest, deleteTest } from '../api/testApi';
import { getAllCourses } from '../api/courseApi';
import { formatDateTime } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

const { Column } = Table;
const { Option } = Select;

const TestList = () => {
    const { user } = useAuth();
    const isAdmin = user.roles?.includes('ADMIN') || false;
    const isTeacher = user.roles?.includes('TEACHER') || false;

    const [tests, setTests] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [form] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        title: '',
        courseId: undefined,
        userId: user.id,
        roles: user.roles ? user.roles.join(',') : '',
    });
    const [paginationInfo, setPaginationInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const searchTimeout = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getAllCourses();
                setCourses(res.data.content || res.data);
            } catch {
                message.error('Не удалось загрузить курсы');
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        fetchTests();
    }, [queryParams]);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.title) delete params.title;
            if (params.courseId === undefined) delete params.courseId;
            const res = await getTests(params);
            setTests(res.data.content);
            setPaginationInfo({
                current: res.data.number + 1,
                pageSize: res.data.size,
                total: res.data.totalElements,
            });
        } catch {
            message.error('Не удалось загрузить тесты');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        setQueryParams(prev => ({
            ...prev,
            page: pagination.current - 1,
            size: pagination.pageSize,
        }));
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setQueryParams(prev => ({
                ...prev,
                title: value,
                page: 0,
            }));
        }, 300);
    };

    const handleFilterChange = (field, value) => {
        setQueryParams(prev => ({
            ...prev,
            [field]: value,
            page: 0,
        }));
    };

    const handleReset = () => {
        setQueryParams(prev => ({
            ...prev,
            page: 0,
            title: '',
            courseId: undefined,
        }));
    };

    const showModal = (test = null) => {
        setEditingTest(test);
        form.resetFields();
        if (test) {
            form.setFieldsValue({
                title: test.title,
                description: test.description,
                content: test.content,
                questionsCount: test.questionsCount !== undefined ? Number(test.questionsCount) : undefined,
                startDate: test.startDate,
                endDate: test.endDate,
                maxDurationMinutes: test.maxDurationMinutes,
                maxAttempts: test.maxAttempts,
                courseId: test.course?.id,
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingTest) {
                await updateTest(editingTest.id, values);
                message.success('Тест обновлён');
            } else {
                await createTest(values);
                message.success('Тест создан');
            }
            setModalVisible(false);
            fetchTests();
        } catch (error) {
            if (error.response?.status === 400) {
                const errors = Object.values(error.response.data).flat().join('\n');
                message.error(errors);
            } else {
                message.error('Ошибка сохранения');
            }
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить тест?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteTest(id);
                    message.success('Тест удалён');
                    fetchTests();
                } catch {
                    message.error('Ошибка удаления');
                }
            }
        });
    };

    const canEdit = (test) => {
        return isAdmin || (isTeacher && test.course?.teacher?.id === user.id);
    };

    return (
        <Spin spinning={loading}>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Space wrap>
                        <Input
                            placeholder="Поиск по названию"
                            allowClear
                            value={queryParams.title}
                            onChange={handleSearchChange}
                            style={{ width: 200 }}
                        />
                        <Select
                            placeholder="Курс"
                            allowClear
                            style={{ width: 150 }}
                            value={queryParams.courseId}
                            onChange={(value) => handleFilterChange('courseId', value)}
                        >
                            {courses.map(course => (
                                <Option key={course.id} value={course.id}>{course.title}</Option>
                            ))}
                        </Select>
                        <Button onClick={handleReset}>Сбросить</Button>
                    </Space>
                    {(isAdmin || isTeacher) && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                            Добавить тест
                        </Button>
                    )}
                </div>

                <Table
                    dataSource={tests}
                    rowKey="id"
                    pagination={{
                        current: paginationInfo.current,
                        pageSize: paginationInfo.pageSize,
                        total: paginationInfo.total,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                    }}
                    onChange={handleTableChange}
                    loading={loading}
                >
                    {isAdmin && <Column title="ID" dataIndex="id" />}
                    <Column
                        title="Название"
                        render={(_, t) => <Link to={`/tests/${t.id}`}>{t.title}</Link>}
                    />
                    <Column
                        title="Курс"
                        render={(_, t) => t.course ? <Link to={`/courses/${t.course.id}`}>{t.course.title}</Link> : '—'}
                    />
                    <Column title="Вопросов" dataIndex="questionsCount" />
                    <Column title="Дата начала" render={(_, t) => formatDateTime(t.startDate)} />
                    <Column title="Дата окончания" render={(_, t) => formatDateTime(t.endDate)} />
                    {(isAdmin || isTeacher) && (
                        <Column
                            title="Действия"
                            render={(_, test) => {
                                if (!canEdit(test)) return null;
                                return (
                                    <Space>
                                        <Button icon={<EditOutlined />} onClick={() => showModal(test)} />
                                        <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(test.id)} />
                                    </Space>
                                );
                            }}
                        />
                    )}
                </Table>

                <Modal
                    title={editingTest ? 'Редактировать тест' : 'Новый тест'}
                    open={modalVisible}
                    onOk={() => form.submit()}
                    onCancel={() => setModalVisible(false)}
                    width={700}
                >
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item name="title" label="Название" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Описание">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="content" label="Содержание" rules={[{ required: true }]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="questionsCount"
                            label="Количество вопросов"
                            rules={[{ required: true, type: 'number', message: 'Введите число' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={1} step={1} />
                        </Form.Item>
                        <Form.Item name="courseId" label="Курс" rules={[{ required: true }]}>
                            <Select placeholder="Выберите курс">
                                {courses.map(course => (
                                    <Option key={course.id} value={course.id}>{course.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="startDate" label="Дата начала">
                            <Input placeholder="YYYY-MM-DDTHH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="endDate" label="Дата окончания">
                            <Input placeholder="YYYY-MM-DDTHH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="maxDurationMinutes" label="Макс. длительность (мин)">
                            <InputNumber style={{ width: '100%' }} min={0} step={1} />
                        </Form.Item>
                        <Form.Item name="maxAttempts" label="Макс. попыток">
                            <InputNumber style={{ width: '100%' }} min={1} step={1} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    );
};

export default TestList;