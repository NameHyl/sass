import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import DishesListForm from '../DishesListForm';
import DishesListTable from '../DishesListTable';
import useStore from '../../../store';
import { observer } from 'mobx-react-lite';
import './index.scss';
function DishesList() {
  const { dishesStore } = useStore();
  const { getProductList, requestBody } = dishesStore;
  const { pageIndex, pageSize, condition } = requestBody;

  useEffect(() => {
    getProductList({
      pageIndex,
      pageSize,
      condition,
    }); //获取菜品列表
  }, []);

  return (
    <div>
      <PageHeader title="菜品管理" msg="创建新菜品" id="2" />
      <DishesListForm />
      <DishesListTable />
    </div>
  );
}

export default observer(DishesList);
