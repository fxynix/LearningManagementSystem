import React, { useState, useEffect, useRef } from 'react';
import {
    Table, Button, Space, Modal, Form, Input, Select, Tag, message, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userApi';
import { getAllRoles } from '../api/roleApi';
import { useAuth } from '../context/AuthContext';

const { Column } = Table;
const { Option } = Select;

const UserList = () => {
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        username: '',
    });
    const [paginationInfo, setPaginationInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const searchTimeout = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, [queryParams]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await getAllRoles();
                setRoles(res.data.content || res.data);
            } catch {
                message.error('Не удалось загрузить роли');
            }
        };
        fetchRoles();
    }, []);

    if (!user.roles?.includes('ADMIN')) {
        return <div>Доступ запрещён</div>;
    }

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.username) delete params.username;
            const res = await getUsers(params);
            setUsers(res.data.content);
            setPaginationInfo({
                current: res.data.number + 1,
                pageSize: res.data.size,
                total: res.data.totalElements,
            });
        } catch {
            message.error('Не удалось загрузить пользователей');
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
                username: value,
                page: 0,
            }));
        }, 300);
    };

    const handleReset = () => {
        setQueryParams({
            page: 0,
            size: 10,
            username: '',
        });
    };

    const showModal = (user = null) => {
        setEditingUser(user);
        form.resetFields();
        if (user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                roleIds: user.roles?.map(r => r.id) || [],
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, values);
                message.success('Пользователь обновлён');
            } else {
                await createUser(values);
                message.success('Пользователь создан');
            }
            setModalVisible(false);
            fetchUsers();
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
            title: 'Удалить пользователя?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteUser(id);
                    message.success('Пользователь удалён');
                    fetchUsers();
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
                    <Space>
                        <Input
                            placeholder="Поиск по логину"
                            allowClear
                            value={queryParams.username}
                            onChange={handleSearchChange}
                            style={{ width: 250 }}
                        />
                        <Button onClick={handleReset}>Сбросить</Button>
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Добавить пользователя
                    </Button>
                </div>

                <Table
                    dataSource={users}
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
                    <Column title="Логин" dataIndex="username" />
                    <Column title="Email" dataIndex="email" />
                    <Column title="Полное имя" dataIndex="fullName" />
                    <Column
                        title="Роли"
                        render={(_, user) => (
                            <Space wrap>
                                {user.roles?.map(role => (
                                    <Tag key={role.id} color="blue">{role.name}</Tag>
                                )) || '—'}
                            </Space>
                        )}
                    />
                    <Column
                        title="Действия"
                        render={(_, user) => (
                            <Space>
                                <Button icon={<EditOutlined />} onClick={() => showModal(user)} />
                                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(user.id)} />
                            </Space>
                        )}
                    />
                </Table>

                <Modal
                    title={editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}
                    open={modalVisible}
                    onOk={() => form.submit()}
                    onCancel={() => setModalVisible(false)}
                    width={600}
                >
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item name="username" label="Логин" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Пароль"
                            rules={[
                                { required: !editingUser, message: 'Введите пароль' },
                                { min: 6, message: 'Минимум 6 символов' }
                            ]}
                        >
                            <Input.Password placeholder={editingUser ? 'Оставьте пустым, чтобы не менять' : ''} />
                        </Form.Item>
                        <Form.Item name="fullName" label="Полное имя">
                            <Input />
                        </Form.Item>
                        <Form.Item name="roleIds" label="Роли">
                            <Select mode="multiple" placeholder="Выберите роли">
                                {roles.map(role => (
                                    <Option key={role.id} value={role.id}>{role.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    );
};

export default UserList;