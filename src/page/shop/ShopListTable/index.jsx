import React, { useState, useRef } from 'react';
import { Table, Button, Space, Typography, Divider, Tag, ConfigProvider, Popconfirm, Switch, Spin, Descriptions } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import useStore from '../../../store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import './index.scss';
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;
const businessTypeContent = [
  { type: 'DINNER', name: '正餐' },
  { type: 'WESTERN_FOOD', name: '西餐' },
  { type: 'HOT_POT', name: '火锅' },
  { type: 'BARBECUE', name: '烧烤' },
  { type: 'FAST_FOOD', name: '快餐' },
];
const managementTypeContent = [
  { type: 'DIRECT_SALES', name: '直营' },
  { type: 'ALLIANCE', name: '加盟' },
];

function ShopListTable() {
  const { shopStore } = useStore();
  const td = useRef(null);
  const [openRow, setOpenRow] = useState([]);
  const navigate = useNavigate();
  const { shopList, openOrCloseShop, managementTypes, businessTypes, keyword, pageSize, enabled, setPageSize, getShopTableList } = shopStore;
  const Shopcolumns = [
    {
      title: '营业状态',
      dataIndex: 'enabled',
      align: 'center',
      render: (isEnabled, record) => {
        return isEnabled ? <Tag color="green">营业中</Tag> : <Tag color="gold">停业中</Tag>;
      },
    },
    {
      title: '门店名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '主营业态',
      dataIndex: 'businessType',
      align: 'center',
      render: (businessType) => {
        return businessTypeContent.find((item) => item.type === businessType).name;
      },
    },
    {
      title: '管理类型',
      dataIndex: 'managementType',
      align: 'center',
      render: (managementType) => {
        return managementTypeContent.find((item) => item.type === managementType).name;
      },
    },
    {
      title: '营业时间',
      dataIndex: 'openingHours',
      align: 'center',
      render: (openingHours) => {
        return (
          <span>
            {openingHours.openTime}~{openingHours.closeTime}
          </span>
        );
      },
    },
    {
      title: '营业面积',
      dataIndex: 'businessArea',
      align: 'center',
      render: (text) => {
        let businessAreaNum = text.substring(0, text.length - 2);
        return `${businessAreaNum} ㎡`;
      },
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (_, record) => {
        return (
          <Space split={<Divider type="vertical" />}>
            <Typography.Link onClick={() => handelShopEdit(record)}>编辑</Typography.Link>
            <Typography.Link>
              <Popconfirm title={`确认${_.enabled ? '停用' : '启用'}吗？`} onConfirm={() => switchOnChange(_)}>
                <Switch checked={_.enabled} size="small" />
              </Popconfirm>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];
  // 分页
  const storePageSize = pageSize;
  const handelPageChange = (pageIndex, pageSize) => {
    storePageSize === pageSize ? (pageIndex = pageIndex) : (pageIndex = 1);
    setPageSize(pageSize);
    getShopTableList({
      pageIndex,
      pageSize,
      condition: {
        enabled,
        keyword,
        managementTypes,
        businessTypes,
      },
    });
  };
  // 编辑
  const handelShopEdit = (record) => {
    navigate(`/shopCreate?businessNo=${record.businessNo}`);
  };
  // 是否停用
  const switchOnChange = (record) => {
    let state = record.enabled ? 'close' : 'open';
    openOrCloseShop(record.businessNo, state, record.version);
  };
  return (
    <ConfigProvider locale={zh_CN}>
      <Table
        dataSource={shopList.records}
        columns={Shopcolumns}
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
        pagination={{
          pageSize: shopList.pageSize,
          total: shopList.totalCount,
          current: shopList.pageIndex,
          pageSizeOptions: ['5', '10', '20'],
          onChange: handelPageChange,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => `共有${total}家门店`,
          size: 'small',
        }}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Descriptions labelStyle={{ color: '#ffbd00' }} layout="horizontal" colon column={3}>
                <Descriptions.Item label="门店ID">{record.businessNo}</Descriptions.Item>
                <Descriptions.Item label="门店名">{record.name}</Descriptions.Item>
                <Descriptions.Item label="面积">{record.businessArea}</Descriptions.Item>
                <Descriptions.Item label="营业状态">{record.enabled ? '营业中' : '停业中'}</Descriptions.Item>
                <Descriptions.Item label="管理类型">{managementTypeContent.find((item) => item.type === record.managementType).name}</Descriptions.Item>
                <Descriptions.Item label="主营业态">{businessTypeContent.find((item) => item.type === record.businessType).name}</Descriptions.Item>
                <Descriptions.Item label="座机号">{record.contact.telephone || '暂无'}</Descriptions.Item>
                <Descriptions.Item label="手机号">{record.contact.cellphone || '暂无'}</Descriptions.Item>
                <Descriptions.Item label="姓名">{record.contact.name}</Descriptions.Item>
                <Descriptions.Item label="营业时间">
                  {record.openingHours.openTime}~{record.openingHours.closeTime}
                </Descriptions.Item>
                <Descriptions.Item label="地址" span={2}>
                  {record.contact.address}
                </Descriptions.Item>
                <Descriptions.Item label="门店描述">{record.comment}</Descriptions.Item>
              </Descriptions>
            );
          },
          rowExpandable: (record) => true,
          expandedRowKeys: openRow,
          onExpand: (expanded, record) => {
            if (expanded) {
              setOpenRow([record.id]);
            } else {
              setOpenRow([]);
            }
          },
        }}
        rowKey={(record) => record.id}
      />
    </ConfigProvider>
  );
}

export default observer(ShopListTable);
