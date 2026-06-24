import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    AppstoreOutlined,
    BookOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    SolutionOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { useAuth, AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import CategoryList from './components/CategoryList';
import CourseList from './components/CourseList';
import LectureList from './components/LectureList';
import TestList from './components/TestList';
import TestAttemptList from './components/TestAttemptList';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LectureDetailPage from './pages/LectureDetailPage';
import TestDetailPage from './pages/TestDetailPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import './App.css';
import RoleDetailPage from "./pages/RoleDetailPage";
import TestPassPage from './pages/TestPassPage';

const { Header, Content } = Layout;

const AppContent = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const isAdmin = user.roles?.includes('ADMIN') || false;
    const isTeacher = user.roles?.includes('TEACHER') || false;

    const getSelectedKey = () => {
        if (location.pathname === '/') return 'home';
        if (location.pathname.startsWith('/users')) return 'users';
        if (location.pathname.startsWith('/roles')) return 'roles';
        if (location.pathname.startsWith('/categories')) return 'categories';
        if (location.pathname.startsWith('/courses')) return 'courses';
        if (location.pathname.startsWith('/lectures')) return 'lectures';
        if (location.pathname.startsWith('/tests')) return 'tests';
        if (location.pathname.startsWith('/attempts')) return 'attempts';
        return 'home';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/favicon.ico" alt="LMS" style={{ height: 28, marginRight: 10 }} />
                    <div style={{ color: '#fff', fontSize: 20, marginRight: 40 }}>LMS</div>
                </Link>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[getSelectedKey()]}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <Link to="/">Главная</Link>
                    </Menu.Item>
                    {isAdmin && (
                        <>
                            <Menu.Item key="users" icon={<UserOutlined />}>
                                <Link to="/users">Пользователи</Link>
                            </Menu.Item>
                            <Menu.Item key="roles" icon={<TeamOutlined />}>
                                <Link to="/roles">Роли</Link>
                            </Menu.Item>
                        </>
                    )}
                    {(isAdmin || isTeacher) && (
                        <>
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
                        </>
                    )}
                    <Menu.Item key="attempts" icon={<SolutionOutlined />}>
                        <Link to="/attempts">Попытки</Link>
                    </Menu.Item>
                </Menu>
                <div style={{ marginLeft: 'auto', color: '#fff' }}>
                    <span style={{ marginRight: 16 }}>{user.username} ({user.roleDescription})</span>
                    <Button type="link" onClick={logout} style={{ color: '#fff' }}>Выйти</Button>
                </div>
            </Header>
            <Content style={{ padding: '24px 24px' }}>
                <Routes>
                    <Route path="/" element={<CoursesPage />} />
                    <Route path="/categories/:id" element={<CategoryDetailPage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/lectures/:id" element={<LectureDetailPage />} />
                    <Route path="/tests/:id" element={<TestDetailPage />} />
                    <Route path="/roles/:id" element={<RoleDetailPage />} />
                    <Route path="/attempts" element={<TestAttemptList />} />
                    <Route path="/tests/:id/pass" element={<TestPassPage />} />
                    {isAdmin && (
                        <>
                            <Route path="/users" element={<UserList />} />
                            <Route path="/roles" element={<RoleList />} />
                        </>
                    )}
                    {(isAdmin || isTeacher) && (
                        <>
                            <Route path="/categories" element={<CategoryList />} />
                            <Route path="/courses" element={<CourseList />} />
                            <Route path="/lectures" element={<LectureList />} />
                            <Route path="/tests" element={<TestList />} />
                        </>
                    )}
                </Routes>
            </Content>
        </Layout>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/*" element={<AppContent />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;