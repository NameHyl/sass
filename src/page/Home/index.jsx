import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import { getHashUrl } from '../../utils/tool';
import './index.scss';
const { Content, Sider } = Layout;
const navsNameArray = [
  { name: '门店管理', path: '/', children: [] },
  { name: '菜品管理', path: '/dishes', children: [] },
  { name: '订单管理', path: '/order', children: [] },
];
const sider_navs = navsNameArray.map((key, index) => {
  return {
    key: `${key.path}`,
    label: `${key.name}`,
  };
});

function Home() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [defaultPath, setDefaultPath] = useState(getHashUrl(location.pathname));
  const navigate = useNavigate();
  // useEffect(() => {
  //   setDefaultPath(getHashUrl(location.pathname));
  // }, []);
  // 侧边菜单点击事件
  const handleMenuSelect = (key_) => {
    navigate(key_.key);
    setDefaultPath(key_.key);
  };
  // 是否收缩侧边菜单
  const onCollapse = (collapsed) => {
    setIsCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider
        width={250}
        className="site-layout-background sider"
        collapsible
        theme="light"
        onCollapse={onCollapse}
        breakpoint="lg"
        trigger={
          isCollapsed ? (
            <span>
              <MenuFoldOutlined />
              &nbsp; 收起导航
            </span>
          ) : (
            <span>
              <MenuUnfoldOutlined />
              &nbsp; 展开导航
            </span>
          )
        }
      >
        <Menu
          mode="inline"
          defaultOpenKeys={[defaultPath]}
          forceSubMenuRender={true}
          openKeys={[defaultPath]}
          selectedKeys={[defaultPath]}
          onSelect={handleMenuSelect}
          style={{
            height: '100%',
            borderRight: 0,
          }}
          items={sider_navs}
        />
      </Sider>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            padding: 10,
            height: '92vh',
            overflow: 'auto',
            margin: 0,
            minHeight: 280,
          }}
        >
          {/* 路由出口 */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
