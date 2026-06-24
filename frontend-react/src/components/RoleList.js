import React, { useState, useEffect, useRef } from 'react';
import {
    Table, Button, Space, Modal, Form, Input, message, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRoles, createRole, updateRole, deleteRole } from '../api/roleApi';
import { getAllUsers } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import {Link} from "react-router-dom";

const { Column } = Table;

const RoleList = () => {
    const { user } = useAuth();

    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [form] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        name: '',
    });
    const [paginationInfo, setPaginationInfo] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const searchTimeout = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers();
                setUsers(res.data.content || res.data);
            } catch {
                message.error('Не удалось загрузить пользователей');
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [queryParams]);

    if (!user.roles?.includes('ADMIN')) {
        return <div>Доступ запрещён</div>;
    }

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.name) delete params.name;
            const res = await getRoles(params);
            const content = res.data.content || res.data;
            setRoles(content);
            if (res.data.content) {
                setPaginationInfo({
                    current: res.data.number + 1,
                    pageSize: res.data.size,
                    total: res.data.totalElements,
                });
            } else {
                setPaginationInfo({
                    current: 1,
                    pageSize: content.length,
                    total: content.length,
                });
            }
        } catch {
            message.error('Не удалось загрузить роли');
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
                name: value,
                page: 0,
            }));
        }, 300);
    };

    const handleReset = () => {
        setQueryParams({
            page: 0,
            size: 10,
            name: '',
        });
    };

    const getUserCountForRole = (roleId) => {
        return users.filter(user => user.roles?.some(r => r.id === roleId)).length;
    };

    const showModal = (role = null) => {
        setEditingRole(role);
        form.resetFields();
        if (role) {
            form.setFieldsValue({
                name: role.name,
                description: role.description,
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRole) {
                await updateRole(editingRole.id, values);
                message.success('Роль обновлена');
            } else {
                await createRole(values);
                message.success('Роль создана');
            }
            setModalVisible(false);
            fetchRoles();
        } catch (error) {
            if (error.response?.status === 400) {
                const errors = Object.values(error.response.data).flat().join('\n');
                message.error(errors);
            } else if (error.response?.status === 409) {
                message.error('Роль с таким названием уже существует');
            } else {
                message.error('Ошибка сохранения');
            }
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить роль?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteRole(id);
                    message.success('Роль удалена');
                    fetchRoles();
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
                            placeholder="Поиск по названию"
                            allowClear
                            value={queryParams.name}
                            onChange={handleSearchChange}
                            style={{ width: 250 }}
                        />
                        <Button onClick={handleReset}>Сбросить</Button>
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Добавить роль
                    </Button>
                </div>

                <Table
                    dataSource={roles}
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
                    <Column
                        title="Название"
                        render={(_, r) => <Link to={`/roles/${r.id}`}>{r.name}</Link>}
                    />
                    <Column title="Описание" dataIndex="description" />
                    <Column
                        title="Пользователей"
                        render={(_, role) => getUserCountForRole(role.id)}
                    />
                    <Column
                        title="Действия"
                        render={(_, role) => (
                            <Space>
                                <Button icon={<EditOutlined />} onClick={() => showModal(role)} />
                                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(role.id)} />
                            </Space>
                        )}
                    />
                </Table>

                <Modal
                    title={editingRole ? 'Редактировать роль' : 'Новая роль'}
                    open={modalVisible}
                    onOk={() => form.submit()}
                    onCancel={() => setModalVisible(false)}
                >
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Описание">
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    );
};

export default RoleList;