import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    AppstoreOutlined,
    BookOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import CategoryList from './components/CategoryList';
import CourseList from './components/CourseList';
import LectureList from './components/LectureList';
import TestList from './components/TestList';
import TestAttemptList from './components/TestAttemptList';
import './App.css';

const { Header, Content } = Layout;

const App = () => {
    const location = useLocation();
    const currentKey = location.pathname.slice(1) || 'users';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/favicon.ico" alt="LMS" style={{ height: 28, marginRight: 10 }} />
                <div style={{ color: '#fff', fontSize: 20, marginRight: 40 }}>LMS</div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[currentKey]}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    <Menu.Item key="users" icon={<UserOutlined />}>
                        <Link to="/users">Пользователи</Link>
                    </Menu.Item>
                    <Menu.Item key="roles" icon={<TeamOutlined />}>
                        <Link to="/roles">Роли</Link>
                    </Menu.Item>
                    <Menu.Item key="categories" icon={<AppstoreOutlined />}>
                        <Link to="/categories">Категории</Link>
                    </Menu.Item>
                    <Menu.Item key="courses" icon={<BookOutlined />}>
                        <Link to="/courses">Курсы</Link>
                    </Menu.Item>
                    <Menu.Item key="lectures" icon={<FileTextOutlined />}>
                        <Link to="/lectures">Лекции</Link>
                    </Menu.Item>
                    <Menu.Item key="tests" icon={<CheckCircleOutlined />}>
                        <Link to="/tests">Тесты</Link>
                    </Menu.Item>
                    <Menu.Item key="attempts" icon={<SolutionOutlined />}>
                        <Link to="/attempts">Попытки</Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '24px 24px' }}>
                <Routes>
                    <Route path="/users" element={<UserList />} />
                    <Route path="/roles" element={<RoleList />} />
                    <Route path="/categories" element={<CategoryList />} />
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/lectures" element={<LectureList />} />
                    <Route path="/tests" element={<TestList />} />
                    <Route path="/attempts" element={<TestAttemptList />} />
                    <Route path="/" element={<UserList />} />
                </Routes>
            </Content>
        </Layout>
    );
};

export default () => (
    <Router>
        <App />
    </Router>
);