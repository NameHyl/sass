import React, { useState } from 'react';
import { Table, Space, Typography, Divider, Tag, ConfigProvider, Popconfirm, Switch, Spin, Descriptions } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';
import { useNavigate } from 'react-router-dom';
import useStore from '../../../store';
import { LoadingOutlined } from '@ant-design/icons';
import './index.scss';
import { observer } from 'mobx-react-lite';
const antIcon = <LoadingOutlined style={{ fontSize: 100 }} spin />;
function DishesListTable() {
  const [openRow, setOpenRow] = useState([]);
  const { dishesStore } = useStore();
  const navigate = useNavigate();
  const { products, getProductList, requestBody, setRequestBody, updateProductStatus } = dishesStore;
  const { condition } = requestBody;
  const DishesColumns = [
    {
      title: '状态',
      dataIndex: 'enabled',
      align: 'center',
      render: (enabled, record) => {
        return enabled ? <Tag color="green">已上架</Tag> : <Tag color="gold">已下架</Tag>;
      },
    },
    {
      title: '菜品名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '菜品单价(元)',
      dataIndex: 'unitPrice',
      align: 'center',
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasure',
      align: 'center',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (_, record) => {
        return (
          <Space split={<Divider type="vertical" />}>
            <Typography.Link onClick={() => editProduct(record)}>编辑</Typography.Link>
            <Typography.Link>
              <Popconfirm title={`确认${_.enabled ? '下架' : '上架'}吗？`} onConfirm={() => onSwitchOnChange(_)}>
                <Switch checked={_.enabled} size="small" />
              </Popconfirm>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  //   分页
  const paginationChange = (pageIndex, pageSize) => {
    getProductList({
      pageIndex,
      pageSize,
      condition,
    });

    setRequestBody({
      pageIndex: 1,
      pageSize,
      condition,
    });
  };
  //   提示框确认按钮
  const onSwitchOnChange = ({ id, enabled, version }) => {
    updateProductStatus(id, enabled, version);
  };
  // 编辑按钮
  const editProduct = (record) => {
    navigate(`/dishes/operate?id=${record.id}`);
  };
  return (
    <ConfigProvider locale={zh_CN}>
      <Table
        dataSource={products.records}
        columns={DishesColumns}
        sticky
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Descriptions
                layout="horizontal"
                colon
                column={3}
                labelStyle={{
                  color: '#ffbd00',
                  padding: '0px 10px',
                }}
              >
                <Descriptions.Item label="菜品ID">{record.id}</Descriptions.Item>
                <Descriptions.Item label="菜名">{record.name}</Descriptions.Item>
                <Descriptions.Item label="价格">
                  {record.unitPrice}
                  {record.unitOfMeasure}
                </Descriptions.Item>
                <Descriptions.Item label="起售量">{record.minSalesQuantity}</Descriptions.Item>
                <Descriptions.Item label="增售量">{record.increaseSalesQuantity}</Descriptions.Item>
                <Descriptions.Item label="状态">{record.enabled ? '上架' : '下架'}</Descriptions.Item>
                <Descriptions.Item label="描述">{record.description}</Descriptions.Item>
              </Descriptions>
            );
          },
          expandedRowKeys: openRow,
          onExpand: (expanded, record) => {
            if (expanded) {
              setOpenRow([record.id]);
            } else {
              setOpenRow([]);
            }
          },
        }}
        pagination={{
          pageSize: products.pageSize,
          total: products.totalCount,
          current: products.pageIndex,
          pageSizeOptions: ['5', '10', '20'],
          onChange: paginationChange,
          showQuickJumper: true,
          size: 'small',
          showSizeChanger: true,
          showTotal: (total, range) => `共有${total}个菜品`,
        }}
        rowKey={(record) => record.id}
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
      />
    </ConfigProvider>
  );
}

export default observer(DishesListTable);
