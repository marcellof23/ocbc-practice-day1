import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import 'antd/dist/antd.css';
import '../assets/css/dashboard.css';
import ProtectedRoute from './auth';
const { Header, Content, Sider } = Layout;
import { useCookies } from 'react-cookie';

function App() {
  return (
    <ProtectedRoute>
      <Layout>
        <Layout style={{ padding: '24px 24px 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              minHeight: 280,
            }}
          >
            INI PROFILE
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}

export default App;
