import React, { useState, useEffect, useRef } from 'react';
import {
    Table, Button, Space, Modal, Form, Input, message, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';

const { Column } = Table;

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
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
        fetchCategories();
    }, [queryParams]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.name) delete params.name;
            const res = await getCategories(params);
            const content = res.data.content || res.data;
            setCategories(content);
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
            message.error('Не удалось загрузить категории');
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

    const showModal = (category = null) => {
        setEditingCategory(category);
        form.resetFields();
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description,
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, values);
                message.success('Категория обновлена');
            } else {
                await createCategory(values);
                message.success('Категория создана');
            }
            setModalVisible(false);
            fetchCategories();
        } catch (error) {
            if (error.response?.status === 400) {
                const errors = Object.values(error.response.data).flat().join('\n');
                message.error(errors);
            } else if (error.response?.status === 409) {
                message.error('Категория с таким названием уже существует');
            } else {
                message.error('Ошибка сохранения');
            }
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить категорию?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteCategory(id);
                    message.success('Категория удалена');
                    fetchCategories();
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
                        Добавить категорию
                    </Button>
                </div>

                <Table
                    dataSource={categories}
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
                    <Column title="Название" dataIndex="name" />
                    <Column title="Описание" dataIndex="description" />
                    <Column
                        title="Действия"
                        render={(_, category) => (
                            <Space>
                                <Button icon={<EditOutlined />} onClick={() => showModal(category)} />
                                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(category.id)} />
                            </Space>
                        )}
                    />
                </Table>

                <Modal
                    title={editingCategory ? 'Редактировать категорию' : 'Новая категория'}
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

export default CategoryList;