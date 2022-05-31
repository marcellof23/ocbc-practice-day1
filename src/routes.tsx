import { Fragment, useEffect, useState, createContext } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import { Layout, Menu, Breadcrumb } from 'antd';
import Icon from '@ant-design/icons';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import 'antd/dist/antd.css';
import './assets/css/dashboard.css';
const { Header, Content, Sider } = Layout;
import Login from './pages/login';
import Profile from './pages/profile';

import { useCookies } from 'react-cookie';
import database from './database/database';

const PRESERVED = import.meta.globEager('/src/pages/(_app|404).tsx');
const ROUTES = import.meta.globEager('/src/pages/**/[a-z[]*.tsx');

const preserved: any = Object.keys(PRESERVED).reduce((preserved, file) => {
  const key = file.replace(/\/src\/pages\/|\.tsx$/g, '');
  return { ...preserved, [key]: PRESERVED[file].default };
}, {});

const routes = Object.keys(ROUTES).map((route) => {
  const path = route
    .replace(/\/src\/pages|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1');

  return { path, component: ROUTES[route].default };
});

const items1: MenuProps['items'] = ['Home', 'Profile', 'About', 'Logout'].map((key) => ({
  key,
  label: `${key}`,
}));

const ProtectedRoute = ({ children }: any) => {
  const user = null;
  console.log('waw');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log('waw');
  return children;
};

function App() {
  const App = preserved?.['_app'] || Fragment;
  const NotFound = preserved?.['404'] || Fragment;

  const UserContext = createContext('user-test');
  const [user, setUser] = useState('notLogged');

  const [cookies, setCookie, removeCookie] = useCookies(['username', 'password']);

  const [signoutTime, setSignoutTime] = useState(3000);
  const [warningTime, setWarningTime] = useState(15000);
  let warnTimeout: any;
  let logoutTimeout: any;

  const warn = () => {
    console.log('Warning');
  };

  const logout = () => {
    const userData = database.find((user) => user.username === cookies.username);
    const isLogged = userData && userData?.password === cookies.password;
    if (isLogged) {
      window.location.href = '/login';
      removeCookie('username', { path: '/' });
      removeCookie('password', { path: '/' });
    }
  };

  const destroy = () => {
    console.log('Session destroyed');
  };
  const setTimeouts = () => {
    warnTimeout = setTimeout(warn, warningTime);
    logoutTimeout = setTimeout(logout, signoutTime);
  };

  const clearTimeouts = () => {
    if (warnTimeout) clearTimeout(warnTimeout);
    if (logoutTimeout) clearTimeout(logoutTimeout);
  };

  useEffect(() => {
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

    const resetTimeout = () => {
      clearTimeouts();
      setTimeouts();
    };

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }

    setTimeouts();
    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
        clearTimeouts();
      }
    };
  }, []);
  return (
    <CookiesProvider>
      <UserContext.Provider value={user}>
        <App>
          <Layout>
            <Header className="header">
              <div className="logo" />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="menu-bar">
                <Menu.Item key="1">
                  <span>Dashboard</span>
                  <Link to="/home" />
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Profile</span>
                  <Link to="/profile" />
                </Menu.Item>
                <Menu.Item key="3">
                  <span>Logout</span>
                  <Link to="/login" />
                </Menu.Item>
              </Menu>
            </Header>
          </Layout>
          <Routes>
            {routes.map(({ path, component: Component = Fragment }) => (
              <Route key={path} path={path} element={<Component />}></Route>
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </App>
      </UserContext.Provider>
    </CookiesProvider>
  );
}

export default App;
