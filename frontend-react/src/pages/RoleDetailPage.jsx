import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoleById, getUsersByRole } from '../api/roleApi';
import { Button, Typography, List, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const RoleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [roleRes, usersRes] = await Promise.all([
                    getRoleById(id),
                    getUsersByRole(id),
                ]);
                setRole(roleRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <Spin tip="Загрузка..." />;
    if (!role) return <div>Роль не найдена</div>;

    return (
        <div>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Назад
            </Button>
            <Title level={2}>Роль: {role.name}</Title>
            <p>{role.description}</p>
            <Title level={4}>
                Пользователи с этой ролью ({users.length})
            </Title>
            {users.length === 0 ? (
                <p>Нет пользователей</p>
            ) : (
                <List
                    dataSource={users}
                    renderItem={(user, index) => (
                        <List.Item>
                            {index + 1}. {user.username} ({user.fullName || user.username})
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default RoleDetailPage;