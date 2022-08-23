import React from 'react';
import { Button, message } from 'antd';
import { LeftOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';
import './index.scss';
function PageHeader(props) {
  const { title, id, msg } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // 返回上一页
  const handleBack = () => {
    if (pathname === '/' || pathname === '/dishes') {
      message.error('已经是首页了');
      return;
    }
    if (pathname === '/shopCreate') {
      navigate('/');
    } else if (pathname === '/dishes/operate') {
      navigate('/dishes');
    } else if (pathname === '/order/operate') {
      navigate('/order');
    }
  };
  // 新建按钮
  const openCreate = () => {
    if (id === '1') {
      navigate('/shopCreate');
    } else if (id === '2') {
      navigate('/dishes/operate');
    } else if (id === '3') {
      navigate('/order/operate');
    }
  };
  return (
    <div className="page-header">
      <div className="page-item-back" title="返回" onClick={handleBack}>
        <LeftOutlined className="back-icon" />
      </div>
      <h1 className="page-item-title">{title}</h1>
      <div className="page-item-create" title={msg}>
        {msg ? (
          <Button className="create-btn" style={{ background: '#fff', border: 0, marginRight: 20 }} onClick={openCreate}>
            {msg}
          </Button>
        ) : null}

        <DatabaseOutlined />
      </div>
    </div>
  );
}

export default PageHeader;
