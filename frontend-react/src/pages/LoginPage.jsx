import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
                username: values.username,
                password: values.password,
            });
            const userData = response.data;
            login(userData);
            message.success('Вы вошли как ' + userData.roleDescription);
            navigate('/');
        } catch (error) {
            if (error.response) {
                const errorMessage = typeof error.response.data === 'string'
                    ? error.response.data
                    : error.response.data?.message || 'Ошибка входа';
                message.error(errorMessage);
            } else {
                message.error('Сервер не отвечает. Проверьте подключение.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Вход в LMS" style={{ width: 400 }}>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="username" label="Логин или Email" rules={[{ required: true }]}>
                        <Input placeholder="Введите логин или email" />
                    </Form.Item>
                    <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
                        <Input.Password placeholder="Введите пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;