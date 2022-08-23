import React from 'react';
import { Card } from 'antd';
import { Outlet } from 'react-router-dom';
function Order() {
  return (
    <Card>
      <Outlet />
    </Card>
  );
}

export default Order;
