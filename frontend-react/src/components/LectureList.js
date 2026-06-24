import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getLectures, createLecture, updateLecture, deleteLecture } from '../api/lectureApi';
import { getAllCourses } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';

const { Column } = Table;
const { Option } = Select;

const LectureList = () => {
    const { user } = useAuth();
    const isAdmin = user.roles?.includes('ADMIN') || false;
    const isTeacher = user.roles?.includes('TEACHER') || false;

    const [lectures, setLectures] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);
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
        fetchLectures();
    }, [queryParams]);

    const fetchLectures = async () => {
        setLoading(true);
        try {
            const params = { ...queryParams };
            if (!params.title) delete params.title;
            if (params.courseId === undefined) delete params.courseId;
            const res = await getLectures(params);
            setLectures(res.data.content);
            setPaginationInfo({
                current: res.data.number + 1,
                pageSize: res.data.size,
                total: res.data.totalElements,
            });
        } catch {
            message.error('Не удалось загрузить лекции');
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

    const showModal = (lecture = null) => {
        setEditingLecture(lecture);
        form.resetFields();
        if (lecture) {
            form.setFieldsValue({
                title: lecture.title,
                content: lecture.content,
                orderNumber: lecture.orderNumber !== undefined ? Number(lecture.orderNumber) : undefined,
                courseId: lecture.course?.id,
            });
        }
        setModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingLecture) {
                await updateLecture(editingLecture.id, values);
                message.success('Лекция обновлена');
            } else {
                await createLecture(values);
                message.success('Лекция создана');
            }
            setModalVisible(false);
            fetchLectures();
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
            title: 'Удалить лекцию?',
            content: 'Это действие необратимо.',
            okText: 'Да, удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await deleteLecture(id);
                    message.success('Лекция удалена');
                    fetchLectures();
                } catch {
                    message.error('Ошибка удаления');
                }
            }
        });
    };

    const canEdit = (lecture) => {
        return isAdmin || (isTeacher && lecture.course?.teacher?.id === user.id);
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
                            Добавить лекцию
                        </Button>
                    )}
                </div>

                <Table
                    dataSource={lectures}
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
                        render={(_, l) => <Link to={`/lectures/${l.id}`}>{l.title}</Link>}
                    />
                    <Column
                        title="Курс"
                        render={(_, l) => l.course ? <Link to={`/courses/${l.course.id}`}>{l.course.title}</Link> : '—'}
                    />
                    <Column title="Порядок" dataIndex="orderNumber" />
                    {(isAdmin || isTeacher) && (
                        <Column
                            title="Действия"
                            render={(_, lecture) => {
                                if (!canEdit(lecture)) return null;
                                return (
                                    <Space>
                                        <Button icon={<EditOutlined />} onClick={() => showModal(lecture)} />
                                        <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(lecture.id)} />
                                    </Space>
                                );
                            }}
                        />
                    )}
                </Table>

                <Modal
                    title={editingLecture ? 'Редактировать лекцию' : 'Новая лекция'}
                    open={modalVisible}
                    onOk={() => form.submit()}
                    onCancel={() => setModalVisible(false)}
                    width={600}
                >
                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        <Form.Item name="title" label="Название" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="content" label="Содержание">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="orderNumber"
                            label="Порядок"
                            rules={[{ type: 'number', message: 'Введите число' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} step={1} />
                        </Form.Item>
                        <Form.Item name="courseId" label="Курс" rules={[{ required: true }]}>
                            <Select placeholder="Выберите курс">
                                {courses.map(course => (
                                    <Option key={course.id} value={course.id}>{course.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    );
};

export default LectureList;