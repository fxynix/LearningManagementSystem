import React, { useState, useEffect, useRef } from 'react';
import {
    Table, Button, Space, Modal, Form, InputNumber, Select, Input, message, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getTestAttempts, createTestAttempt, updateTestAttempt, deleteTestAttempt } from '../api/testAttemptApi';
import { getAllTests } from '../api/testApi';
import { getAllUsers } from '../api/userApi';
import { formatDateTime } from '../utils/dateUtils';

const { Column } = Table;
const { Option } = Select;

const translateStatus = (status) => {
    const map = {
        'IN_PROGRESS': 'В процессе',
        'COMPLETED': 'Завершено',
        'FAILED': 'Провалено'
    };
    return map[status] || status;
};

const TestAttemptList = () => {
    const [attempts, setAttempts] = useState([]);
    const [tests, setTests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAttempt, setEditingAttempt] = useState(null);
    const [form] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        testTitle: '',
        userUsername: '',
    });
    const [paginationInfo, setPaginationInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const searchTimeout = useRef(null);

    useEffect(() => {
        const fetchSelects = async () => {
            try {
                const [testsRes, usersRes] = await Promise.all([
                    getAllTests(),
                    getAllUsers()
                ]);
                setTests(testsRes.data.content || testsRes.data);
                setUsers(usersRes.data.content || usersRes.data);
            } catch {
                message.error('Не удалось загрузить справочники');
            }
        };
        fetchSelects();
    }, []);

    useEffect(() => {
        fetchAttempts();
    }, [queryParams]);

    const fetchAttempts = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.testTitle) delete params.testTitle;
            if (!params.userUsername) delete params.userUsername;
            const res = await getTestAttempts(params);
            setAttempts(res.data.content);
            setPaginationInfo({
                current: res.data.number + 1,
                pageSize: res.data.size,
                total: res.data.totalElements,
            });
        } catch {
            message.error('Не удалось загрузить попытки');
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

    const handleSearchChange = (field) => (e) => {
        const value = e.target.value;
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setQueryParams(prev => ({
                ...prev,
                [field]: value,
                page: 0,
            }));
        }, 300);
    };

    const handleReset = () => {
        setQueryParams({
            page: 0,
            size: 10,
            testTitle: '',
            userUsername: '',
        });
    };

    const showModal = (attempt = null) => {
        setEditingAttempt(attempt);
        form.resetFields();
        if (attempt) {
            form.setFieldsValue({
                attemptNumber: attempt.attemptNumber,
                startTime: attempt.startTime,
                endTime: attempt.endTime,
                score: attempt.score,
                status: attempt.status,
                testId: attempt.test?.id,
                userId: attempt.user?.id,
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingAttempt) {
                await updateTestAttempt(editingAttempt.id, values);
                message.success('Попытка обновлена');
            } else {
                await createTestAttempt(values);
                message.success('Попытка создана');
            }
            setModalVisible(false);
            fetchAttempts();
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
            title: 'Удалить попытку?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteTestAttempt(id);
                    message.success('Попытка удалена');
                    fetchAttempts();
                } catch {
                    message.error('Ошибка удаления');
                }
            }
        });
    };

    return (
        <Spin spinning={loading}>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Space wrap>
                        <Input
                            placeholder="Поиск по названию теста"
                            allowClear
                            value={queryParams.testTitle}
                            onChange={handleSearchChange('testTitle')}
                            style={{ width: 205 }}
                        />
                        <Input
                            placeholder="Поиск по логину пользователя"
                            allowClear
                            value={queryParams.userUsername}
                            onChange={handleSearchChange('userUsername')}
                            style={{ width: 240 }}
                        />
                        <Button onClick={handleReset}>Сбросить</Button>
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Добавить попытку
                    </Button>
                </div>

                <Table
                    dataSource={attempts}
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
                    <Column title="ID" dataIndex="id" />
                    <Column title="Тест" render={(_, a) => a.test?.title || '—'} />
                    <Column title="Пользователь" render={(_, a) => a.user?.username || '—'} />
                    <Column title="Попытка №" dataIndex="attemptNumber" />
                    <Column title="Начало" render={(_, a) => formatDateTime(a.startTime)} />
                    <Column title="Конец" render={(_, a) => formatDateTime(a.endTime)} />
                    <Column title="Балл" dataIndex="score" />
                    <Column title="Статус" render={(_, a) => translateStatus(a.status)} />
                    <Column
                        title="Действия"
                        render={(_, a) => (
                            <Space>
                                <Button icon={<EditOutlined />} onClick={() => showModal(a)} />
                                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(a.id)} />
                            </Space>
                        )}
                    />
                </Table>

                <Modal
                    title={editingAttempt ? 'Редактировать попытку' : 'Новая попытка'}
                    open={modalVisible}
                    onOk={() => form.submit()}
                    onCancel={() => setModalVisible(false)}
                    width={600}
                >
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item name="testId" label="Тест" rules={[{ required: true }]}>
                            <Select placeholder="Выберите тест">
                                {tests.map(test => (
                                    <Option key={test.id} value={test.id}>{test.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="userId" label="Пользователь" rules={[{ required: true }]}>
                            <Select placeholder="Выберите пользователя">
                                {users.map(user => (
                                    <Option key={user.id} value={user.id}>{user.username}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="attemptNumber"
                            label="Номер попытки"
                            rules={[{ required: true, type: 'number', message: 'Введите число' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={1} step={1} />
                        </Form.Item>
                        <Form.Item name="startTime" label="Время начала">
                            <Input placeholder="YYYY-MM-DDTHH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="endTime" label="Время окончания">
                            <Input placeholder="YYYY-MM-DDTHH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="score" label="Балл">
                            <InputNumber style={{ width: '100%' }} min={0} step={1} />
                        </Form.Item>
                        <Form.Item name="status" label="Статус">
                            <Select placeholder="Выберите статус">
                                <Option value="IN_PROGRESS">В процессе</Option>
                                <Option value="COMPLETED">Завершено</Option>
                                <Option value="FAILED">Провалено</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    );
};

export default TestAttemptList;