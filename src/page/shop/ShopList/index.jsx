import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import PageHeader from '../../../components/PageHeader';
import ShopListForm from '../ShopListForm';
import ShopListTable from '../ShopListTable';
import { observer } from 'mobx-react-lite';
import useStore from '../../../store';
// import { LoadingOutlined } from '@ant-design/icons';
import './index.scss';
// const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;
function ShopList() {
  const { shopStore } = useStore();
  const [loading, setLoading] = useState(true);
  const { managementTypes, businessTypes, getShopTableList, pageSize, pageIndex, enabled, keyword, shopList } = shopStore;
  const data = {
    pageIndex,
    pageSize,
    condition: {
      enabled,
      keyword,
      managementTypes,
      businessTypes,
    },
  };
  useEffect(() => {
    setTimeout(() => {
      getShopTableList(data);
    }, 300);
  }, []);

  return (
    <Card>
      <PageHeader title="门店管理" id="1" msg="创建新门店" />
      <ShopListForm />
      <ShopListTable />
    </Card>
  );
}

export default observer(ShopList);
