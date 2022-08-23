import React from 'react';
import './index.scss';
import PageHeader from '../../../components/PageHeader';
import { Card } from 'antd';
import { Outlet } from 'react-router-dom';
function Dishes() {
  return (
    <Card>
      <Outlet />
    </Card>
  );
}

export default Dishes;
