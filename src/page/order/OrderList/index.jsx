import React from 'react';
import PageHeader from '../../../components/PageHeader';
import OrderListForm from '../OrderListForm';
import OrderListTable from '../OrderListTable';
import useStore from '../../../store';
function OrderList() {
  const { orderStore } = useStore();
  return (
    <>
      <PageHeader title="订单管理" msg="下单" id="3" />
      <OrderListForm />
      <OrderListTable />
    </>
  );
}

export default OrderList;
