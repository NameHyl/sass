import React from 'react';
import { observer } from 'mobx-react-lite';
import './index.scss';
import { Table, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;
function OrderListTable() {
  const orderColumns = [
    {
      title: '状态',
      dataIndex: 'enabled',
    },
    {
      title: '门店',
      dataIndex: 'storeName',
    },
    {
      title: '座位号',
      dataIndex: 'seatNumber',
    },
    {
      title: '就餐人数',
      dataIndex: 'num',
    },
    {
      title: '订单总价',
      dataIndex: 'unitPrice',
    },
    {
      title: '操作',
    },
  ];
  const orderData = [];
  return (
    <Table
      bordered
      locale={{
        emptyText: (
          <Spin
            indicator={antIcon}
            style={{
              color: '#ffdb00',
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            spinning={true}
          />
        ),
      }}
      columns={orderColumns}
      dataSource={orderData}
    />
  );
}
export default observer(OrderListTable);
