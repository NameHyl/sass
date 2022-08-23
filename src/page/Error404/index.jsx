import { Button, Image } from 'antd';
import React from 'react';
import './index.scss';
import bg from '../../assets/image/bg.jpg';
import { useNavigate } from 'react-router-dom';
function Error404() {
  const navigate = useNavigate();
  return (
    <div className="error">
      <div className="err-left">
        <div className="err-left-top">404</div>
        <div className="err-left-center">抱歉你访问的页面走丢了</div>
        <div className="err-left-bottom">
          <Button
            onClick={() => {
              navigate('/', 'replace');
            }}
          >
            返回首页
          </Button>
        </div>
      </div>
      <div className="err-right">
        <Image
          src={bg}
          preview={false}
          style={{
            width: '50vw',
            height: '100vh',
          }}
        />
      </div>
    </div>
  );
}

export default Error404;
