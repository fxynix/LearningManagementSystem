import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Tag, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseApi';
import { getAllCategories } from '../api/categoryApi';
import { getAllUsers } from '../api/userApi';
import { getAllRoles } from '../api/roleApi';
import { useAuth } from '../context/AuthContext';

const { Column } = Table;
const { Option } = Select;

const CourseList = () => {
    const { user } = useAuth();
    const isAdmin = user.roles?.includes('ADMIN') || false;
    const isTeacher = user.roles?.includes('TEACHER') || false;

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        title: '',
        categoryId: undefined,
        teacherId: undefined,
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
        const fetchSelects = async () => {
            try {
                const [catRes, teachRes, roleRes] = await Promise.all([
                    getAllCategories(),
                    getAllUsers(),
                    getAllRoles(),
                ]);
                setCategories(catRes.data.content || catRes.data);
                setTeachers(teachRes.data.content || teachRes.data);
                setRoles(roleRes.data.content || roleRes.data);
            } catch {
                message.error('Не удалось загрузить справочники');
            }
        };
        fetchSelects();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [queryParams]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.title) delete params.title;
            if (params.categoryId === undefined) delete params.categoryId;
            if (params.teacherId === undefined) delete params.teacherId;
            // userId и roles всегда есть, их не удаляем
            const res = await getCourses(params);
            setCourses(res.data.content);
            setPaginationInfo({
                current: res.data.number + 1,
                pageSize: res.data.size,
                total: res.data.totalElements,
            });
        } catch {
            message.error('Не удалось загрузить курсы');
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
            categoryId: undefined,
            teacherId: undefined,
        }));
    };

    const showModal = (course = null) => {
        setEditingCourse(course);
        form.resetFields();
        if (course) {
            form.setFieldsValue({
                title: course.title,
                description: course.description,
                categoryId: course.category?.id,
                teacherId: course.teacher?.id,
                roleIds: course.roles?.map(r => r.id) || [],
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, values);
                message.success('Курс обновлён');
            } else {
                await createCourse(values);
                message.success('Курс создан');
            }
            setModalVisible(false);
            fetchCourses();
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
            title: 'Удалить курс?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteCourse(id);
                    message.success('Курс удалён');
                    fetchCourses();
                } catch {
                    message.error('Ошибка удаления');
                }
            }
        });
    };

    const canEdit = (course) => {
        return isAdmin || (isTeacher && course.teacher?.id === user.id);
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
                            placeholder="Категория"
                            allowClear
                            style={{ width: 150 }}
                            value={queryParams.categoryId}
                            onChange={(value) => handleFilterChange('categoryId', value)}
                        >
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Преподаватель"
                            allowClear
                            style={{ width: 150 }}
                            value={queryParams.teacherId}
                            onChange={(value) => handleFilterChange('teacherId', value)}
                        >
                            {teachers.map(user => (
                                <Option key={user.id} value={user.id}>
                                    {user.fullName || user.username}
                                </Option>
                            ))}
                        </Select>
                        <Button onClick={handleReset}>Сбросить</Button>
                    </Space>
                    {(isAdmin || isTeacher) && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                            Добавить курс
                        </Button>
                    )}
                </div>

                <Table
                    dataSource={courses}
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
                        render={(_, c) => <Link to={`/courses/${c.id}`}>{c.title}</Link>}
                    />
                    <Column
                        title="Категория"
                        render={(_, c) => c.category ? <Link to={`/categories/${c.category.id}`}>{c.category.name}</Link> : '—'}
                    />
                    <Column title="Преподаватель" render={(_, c) => c.teacher?.fullName || '—'} />
                    <Column
                        title="Роли (доступ)"
                        render={(_, c) => (
                            <Space wrap>
                                {c.roles?.map(role => (
                                    <Link key={role.id} to={`/roles/${role.id}`}>
                                        <Tag color="blue">{role.name}</Tag>
                                    </Link>
                                )) || '—'}
                            </Space>
                        )}
                    />
                    {(isAdmin || isTeacher) && (
                        <Column
                            title="Действия"
                            render={(_, course) => {
                                if (!canEdit(course)) return null;
                                return (
                                    <Space>
                                        <Button icon={<EditOutlined />} onClick={() => showModal(course)} />
                                        <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(course.id)} />
                                    </Space>
                                );
                            }}
                        />
                    )}
                </Table>

                <Modal
                    title={editingCourse ? 'Редактировать курс' : 'Новый курс'}
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
                        <Form.Item name="categoryId" label="Категория">
                            <Select placeholder="Выберите категорию" allowClear>
                                {categories.map(cat => (
                                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="teacherId" label="Преподаватель" rules={[{ required: true }]}>
                            <Select placeholder="Выберите преподавателя">
                                {teachers.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.fullName || user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="roleIds" label="Роли (доступ)">
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

export default CourseList;