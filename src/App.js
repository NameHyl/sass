import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Menu, Image, message } from 'antd';
import logo from './assets/image/logo.svg';
import './App.scss';
const { Header } = Layout;
const navs = ['运营中心', '营销中心', '会员中心', '库存管理', '报表中心'].map((key) => ({
  key,
  label: `${key}`,
}));

function App() {
  useEffect(() => {
    message.config({
      duration: 2,
      maxCount: 2,
    });
  }, []);
  return (
    <>
      <Layout>
        <Header className="header">
          <div className="header-left">
            <div className="logo">
              <Image src={logo} width={180} height={60} preview={false} alt="美团管家" />
            </div>
            <Menu className="header-menu" theme="light" mode="horizontal" defaultSelectedKeys={['运营中心']} items={navs} />
          </div>
          <div className="header-right">
            <div className="msg">消息</div>
            <div className="help">帮助</div>
          </div>
        </Header>
      </Layout>
      <Outlet />
    </>
  );
}

export default App;
