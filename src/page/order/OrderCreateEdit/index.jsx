import { Button, Col, Form, Row, Input, InputNumber, Table, Tag, Divider, Modal, message } from 'antd';
import React, { useState } from 'react';
import ProductInfo from '../ProductInfo';
import PageHeader from '../../../components/PageHeader';
import './index.scss';
function OrderCreateEdit() {
  const [selectShop, setSelectShop] = useState(null);
  const [placeTheOrderData, setPlaceTheOrderData] = useState([
    { id: 1, unitPrice: 10.0, unitOfMeasure: '元/份', totalPrice: 0 },
    { id: 2, unitPrice: 20.0, unitOfMeasure: '元/斤', totalPrice: 0 },
  ]);
  const orderColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '菜品名',
      className: 'column',
    },
    {
      title: '数量',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasure',
    },
    {
      title: '总价',
      dataIndex: 'totalPrice',
    },
    {
      title: '',
    },
  ];
  // 选择门店
  const handleSelectShop = () => {
    const shopModalColumns = [
      {
        title: '门店名',
        dataIndex: 'name',
      },
      {
        title: '主营业态',
        dataIndex: 'businessTypes',
      },
      {
        title: '管理类型',
        dataIndex: 'managementTypes',
      },
      {
        title: '营业时间',
        dataIndex: 'openingHours',
      },
      {
        title: '营业面积',
        dataIndex: 'businessArea',
      },
    ];
    const shopModalData = [
      { id: 1, name: '东软店', businessTypes: '餐饮', managementTypes: '自动', openingHours: '09:00-18:00', businessArea: '100平米' },
      { id: 2, name: '成都店', businessTypes: '餐饮', managementTypes: '自动', openingHours: '09:00-18:00', businessArea: '100平米' },
      { id: 3, name: '上海店', businessTypes: '餐饮', managementTypes: '自动', openingHours: '09:00-18:00', businessArea: '100平米' },
    ];
    Modal.confirm({
      width: '80%',
      icon: false,
      okText: '确认',
      cancelText: '取消',
      onCancel: () => {
        console.log(111);
      },
      onOk: () => {
        if (!selectShop) {
          message.warning('请选择门店');
        }
        return false;
      },
      content: (
        <Table
          className="shop-modal-table"
          columns={shopModalColumns}
          dataSource={shopModalData}
          rowKey={(record) => record.id}
          rowClassName={(record, index) => {
            return `shop-modal-row row-${index}`;
          }}
          onRow={(record) => {
            return {
              onClick: (e) => {
                console.log(record);
                const htmlNodeArray = document.querySelectorAll('.shop-modal-row');
                htmlNodeArray.forEach((item) => {
                  item.style.background = '#fff';
                  item.style.color = '#000';
                });
                e.target.parentNode.style.background = '#ffbd00';
                e.target.parentNode.style.color = '#fff';
              }, // 点击行
              // onMouseEnter: (e) => {},
            };
          }}
        />
      ),
    });
  };

  return (
    <div>
      <PageHeader title="下单" />
      <Form colon={false}>
        <div className="form-title">基本信息</div>
        <br />
        <Row gutter={[15]}>
          <Col span={12}>
            <Form.Item label="门店" name="shop" initialValue="">
              <div className="order-shop">
                <Input className="order-shop-ipt" />
                <Button type="primary" className="order-shop-btn" onClick={handleSelectShop}>
                  选择
                </Button>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="座位号" name="setNumber" initialValue="">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[15]}>
          <Col span={12}>
            <Form.Item label="用餐人数" name="theNumberOfMeals" initialValue="">
              <InputNumber max={999} controls={false} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="note" initialValue="">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <div className="form-title">菜品信息</div>
        <br />
        <Table
          columns={orderColumns}
          components={{
            body: {
              row: (props) => {
                return <ProductInfo />;
              },
            },
          }}
        />
        <Divider className="foot-divider" />
        <div className="foot-btns">
          <div>
            <Button className="cancel-btn btn-item">取消</Button>
            <Button className="save-btn btn-item" type="primary">
              保存并返回
            </Button>
            <Button className="save-btn btn-item" type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default OrderCreateEdit;
